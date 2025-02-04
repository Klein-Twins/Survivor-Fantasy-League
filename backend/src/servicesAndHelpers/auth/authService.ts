import { UserAttributes } from '../../models/account/User';
import userRepository from '../../repositories/userRepository';
import jwt from 'jsonwebtoken';
import { LoginRequestFields } from '../../types/auth/authTypes';
import errorFactory from '../../utils/errors/errorFactory';
import accountService from './accountService';
import passwordService from '../password/passwordService';
import logger from '../../config/logger';
import { UnauthorizedError } from '../../utils/errors/errors';
import { UNAUTHORIZED_ERROR } from '../../constants/auth/responseErrorConstants';
import { Request, Response, NextFunction } from 'express';
import { TokenType, UserJwtPayload } from '../../types/auth/tokenTypes';
import tokenService from './tokenService';
import tokenRepository from '../../repositories/tokenRepository';
import userService from '../user/userService';
import { Account, LoginUserRequestBody } from '../../generated-api';

async function authenticateAccount(account: Account, password: string): Promise<boolean> {
  return await passwordService.doesAccountPasswordMatch(account, password);
}

async function logoutAccount(
  req: Request,
  res: Response,
  next: NextFunction,
  isAuthenticated: boolean
): Promise<number> {
  const accessToken: string | undefined = req.cookies.accessToken;
  const refreshToken: string | undefined = req.cookies.refreshToken;
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  const profileIdReqParam: string | undefined = req.query.profileId as string;
  const accessTokenDecoded: UserJwtPayload | null = res.locals.accessTokenDecoded;
  const refreshTokenDecoded: UserJwtPayload | null = res.locals.refreshTokenDecoded;

  if (isAuthenticated) {
    return await normalLogout(profileIdReqParam);
  } else {
    return await extensiveLogout({
      accessToken,
      refreshToken,
      profileIdReqParam,
      accessTokenDecoded,
      refreshTokenDecoded,
    });
  }
}

async function extensiveLogout(data: {
  accessToken: string | undefined;
  refreshToken: string | undefined;
  profileIdReqParam: string | undefined;
  accessTokenDecoded: UserJwtPayload | null;
  refreshTokenDecoded: UserJwtPayload | null;
}): Promise<number> {
  return await tokenService.clearAllTokenData({
    accessTokenDecoded: data.accessTokenDecoded,
    refreshTokenDecoded: data.refreshTokenDecoded,
    refreshToken: data.refreshToken,
    accessToken: data.accessToken,
  });
}

async function normalLogout(profileId: string): Promise<number> {
  const numSessionsDeleted = await tokenRepository.deleteTokenRecordsByProfileId(profileId);
  if (numSessionsDeleted !== 1) {
    logger.warn(`Normal Logout led to deleting ${profileId} sessions`);
  }
  return numSessionsDeleted;
}

async function authenticateToken(token: string, tokenType: TokenType): Promise<boolean> {
  const tokenDecoded: UserJwtPayload | null = jwt.decode(token) as UserJwtPayload | null;

  if (!tokenDecoded) {
    logger.error(`${tokenType} token is not a valid JWT token`);
    return false;
  }

  const isTokenInDatabase = await tokenService.verifyTokenInDatabase(tokenDecoded.userId, token, 'refresh');
  if (!isTokenInDatabase) {
    logger.error(`${tokenType} ${token} assigned to userId ${tokenDecoded.userId} is not in database`);
    return false;
  }

  const isTokenExpired = await tokenService.isTokenExpired(token, tokenType);
  if (isTokenExpired) {
    logger.error(`${tokenType} token is expired`);
    if (tokenType === 'refresh') {
      return false;
    }
  }

  return true;
}

const authService = {
  authenticateAccount,
  authenticateToken,
};

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

const validateTokensInDatabase = async (userId: string, accessToken: string, refreshToken: string): Promise<void> => {
  const areTokensValid = await tokenService.verifyTokensInDatabase(accessToken, refreshToken, userId);
  if (!areTokensValid) {
    logger.error('Tokens do not belong to user ID in database');
    throw errorFactory(UNAUTHORIZED_ERROR);
  }
};

export default authService;
