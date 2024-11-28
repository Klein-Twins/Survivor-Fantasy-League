import { UserAttributes } from '../../models/User';
import userRepository from '../../repositories/userRepository';
import jwt from 'jsonwebtoken';
import { Account, LoginRequestFields } from '../../types/auth/authTypes';
import errorFactory from '../../utils/errors/errorFactory';
import accountService from './accountService';
import passwordService from '../password/passwordService';
import logger from '../../config/logger';
import { UnauthorizedError } from '../../utils/errors/errors';
import { UNAUTHORIZED_ERROR } from '../../constants/auth/responseErrorConstants';
import { Request, Response, NextFunction } from 'express';
import { UserJwtPayload } from '../../types/auth/tokenTypes';
import tokenService from './tokenService';
import tokenRepository from '../../repositories/tokenRepository';
import userService from '../user/userService';

const authService = {

  /**
   * Handles user login by validating the provided email and password.
   * If the credentials are correct, it returns the account details.
   * 
   * @param loginRequestData - The login request data containing the user's email and password.
   * @returns A promise that resolves to the account details if authentication is successful.
   * @throws A 401 error if the password is incorrect.
   */
  login: async (loginRequestData: LoginRequestFields): Promise<Account | null> => {
    const { email, password } = loginRequestData;

    // Retrieve user record based on email
    const userRecord: UserAttributes | null = await userRepository.findUserRecordByEmail(email);
    if (!userRecord) {
      throw errorFactory(errorFactory(UNAUTHORIZED_ERROR))
    }
    logger.debug(`Found user record for ${email}`);

    // Check if the provided password matches the stored user password
    const isAuthenticated: boolean = await passwordService.checkPasswordAgainstUserPassword(userRecord, password);
    logger.debug(`User is authenticated`);

    if (!isAuthenticated) {
      throw errorFactory(new UnauthorizedError());
    }

    // Fetch and return account details
    return await accountService.getAccount({ email });
  },

  logout: async (req: Request, res: Response, next: NextFunction, isAuthenticated: boolean): Promise<number> => {
    const accessToken: string | undefined = req.cookies.accessToken;
    const refreshToken: string | undefined = req.cookies.refreshToken;
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    const profileIdReqParam: string | undefined = req.query.profileId as string;
    const accessTokenDecoded: UserJwtPayload | null = res.locals.accessTokenDecoded;
    const refreshTokenDecoded: UserJwtPayload | null = res.locals.refreshTokenDecoded;


    if (isAuthenticated) {
      return await authService.normalLogout(profileIdReqParam)
    } else {
      return await authService.extensiveLogout({ accessToken, refreshToken, profileIdReqParam, accessTokenDecoded, refreshTokenDecoded });
    }

  },

  extensiveLogout: async (data: {
    accessToken: string | undefined,
    refreshToken: string | undefined,
    profileIdReqParam: string | undefined,
    accessTokenDecoded: UserJwtPayload | null,
    refreshTokenDecoded: UserJwtPayload | null
  }
  ): Promise<number> => {
    return await tokenService.clearAllTokenData({
      accessTokenDecoded: data.accessTokenDecoded,
      refreshTokenDecoded: data.refreshTokenDecoded,
      profileIdReqParam: data.profileIdReqParam,
      refreshToken: data.refreshToken,
      accessToken: data.accessToken
    })
  },

  normalLogout: async (profileId: string): Promise<number> => {
    const numSessionsDeleted = await tokenRepository.deleteTokenRecordsByProfileId(profileId)
    if (numSessionsDeleted !== 1) {
      logger.warn(`Normal Logout led to deleting ${profileId} sessions`)
    }
    return numSessionsDeleted;
  },

  authenticateTokens: async ({ profileId, accessToken, refreshToken }: { profileId?: string, accessToken?: string, refreshToken?: string }, res: Response): Promise<void> => {
    // Validate presence of required data for authorization
    if (!profileId || !accessToken || !refreshToken) {
      logger.error('Missing profileId or tokens in request');
      throw errorFactory(UNAUTHORIZED_ERROR);
    }

    //Decode and check userId and profileId pairing
    const accessTokenDecoded = jwt.decode(accessToken) as UserJwtPayload | null;
    res.locals.accessTokenDecoded = accessTokenDecoded;
    const refreshTokenDecoded = jwt.decode(refreshToken) as UserJwtPayload | null;
    res.locals.refreshTokenDecoded = refreshTokenDecoded;

    if (!accessTokenDecoded || !refreshTokenDecoded) {
      logger.error("Cannot decode access or refresh token")
      throw errorFactory(UNAUTHORIZED_ERROR);
    }

    const userIdTiedToProfileId = await userService.getUserIdByProfileId(profileId);
    if (!userIdTiedToProfileId) {
      logger.error("Profile ID has no user ID attached");
      throw errorFactory(UNAUTHORIZED_ERROR);
    }

    logger.debug(`useridTiedToProfileId = ${userIdTiedToProfileId}`);

    await validateProfileAndUserWithTokens(profileId, userIdTiedToProfileId, accessTokenDecoded, refreshTokenDecoded);
    await validateTokensInDatabase(userIdTiedToProfileId, accessToken, refreshToken);

    //Check if access token and refresh token is expired
    const isAccessTokenExpired = await tokenService.isTokenExpired(accessToken, 'access');
    const isRefreshTokenExpired = await tokenService.isTokenExpired(refreshToken, 'refresh');

    //Refresh token must be valid to allow authorization
    if (isRefreshTokenExpired) {
      logger.error("Refresh token is expired");
      throw errorFactory(UNAUTHORIZED_ERROR);
    }

    //Refresh token is valid and access token is invalid, refresh refresh token
    else if (isAccessTokenExpired) {
      logger.debug("Access token is expired. Generating a new one");
      await tokenService.createAndAttachTokenToResponse(refreshTokenDecoded.userId, refreshTokenDecoded.profileId, 'access', res);
    }
  }
}

const validateProfileAndUserWithTokens = async (
  profileId: string,
  userId: string,
  decodedAccessToken: UserJwtPayload,
  decodedRefreshToken: UserJwtPayload
): Promise<void> => {

  logger.debug(`${profileId} = ${decodedAccessToken.profileId} = ${decodedRefreshToken.profileId}`);
  logger.debug(`${userId} = ${decodedAccessToken.userId} = ${decodedRefreshToken.userId}`);

  if (
    (decodedAccessToken && profileId !== decodedAccessToken.profileId) ||
    (decodedRefreshToken && profileId !== decodedRefreshToken.profileId) ||
    (decodedAccessToken && userId !== decodedAccessToken.userId) ||
    (decodedRefreshToken && userId !== decodedRefreshToken.userId)
  ) {
    logger.error('Mismatch between profileId, userId and token payload');
    throw errorFactory(UNAUTHORIZED_ERROR);
  }
};

const validateTokensInDatabase = async (
  userId: string,
  accessToken: string,
  refreshToken: string
): Promise<void> => {
  const areTokensValid = await tokenService.verifyTokensInDatabase(accessToken, refreshToken, userId);
  if (!areTokensValid) {
    logger.error('Tokens do not belong to user ID in database');
    throw errorFactory(UNAUTHORIZED_ERROR);
  }
};

export default authService;