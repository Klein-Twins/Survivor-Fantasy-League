import jwt from 'jsonwebtoken';
import {
  JWT_ACCESS_EXPIRATION,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRATION,
  NODE_ENV,
} from '../../config/config';
import tokenRepository from '../../repositories/tokenRepository';
import logger from '../../config/logger';
import { Response } from 'express';
import { TokenType, UserJwtPayload } from '../../types/auth/tokenTypes';
import accountService from './accountService';
import { INTERNAL_SERVER_ERROR } from '../../constants/auth/responseErrorConstants';
import { Account } from '../../generated-api/models';
import { InternalServerError } from '../../utils/errors/errors';

export const blacklistedTokens = new Set<string>();

const getTokenSecret = (tokenType: TokenType) => {
  if (tokenType == 'access') {
    return JWT_ACCESS_SECRET;
  } else {
    return JWT_REFRESH_SECRET;
  }
};

const getTokenExpiresIn = (tokenType: TokenType) => {
  if (tokenType == 'access') {
    return JWT_ACCESS_EXPIRATION;
  } else {
    return JWT_REFRESH_EXPIRATION;
  }
};
// createAndAttachTokenToResponse: async (userId: UserAttributes['userId'], profileId: ProfileAttributes['profileId'], tokenType: TokenType, res: Response) => {
//     const token = tokenService.createToken({ userId, profileI },d tokenType);
//     await tokenRepository.upsertTokenIntoDatabase(token, userId, tokenType);
//     tokenService.attachTokenToResponse(token, tokenType, res);
//     return token;
// },

// createAndAttachTokensToResponse: async (userId: UserAttributes['userId'], profileId: ProfileAttributes['profileId'], res: Response): Promise<{ accessToken: string, refreshToken: string }> => {
//     const accessToken = await tokenService.createAndAttachTokenToResponse(userId, profileId, 'access', res);
//     const refreshToken = await tokenService.createAndAttachTokenToResponse(userId, profileId, 'refresh', res);
//     return { accessToken, refreshToken };
// },

async function createNewAccessTokenFromRefreshToken(refreshToken: string): Promise<string | null> {
  const decodedRefreshToken = jwt.decode(refreshToken) as UserJwtPayload;
  if (!decodedRefreshToken) {
    logger.error('Error decoding refresh token');
    return null;
  }
  const account: Account | null = await accountService.getAccountByUserId(decodedRefreshToken.userId);
  if (!account) {
    logger.error('No refresh token user id is not tied to an account');
    return null;
  }

  const newAccessToken = tokenService.createToken(account, 'access');
  return newAccessToken;
}

function createToken(account: Account, tokenType: TokenType): string {
  const payload: UserJwtPayload = {
    userId: account.userId,
    profileId: account.profileId,
  };
  const tokenSecret = getTokenSecret(tokenType);
  const tokenExpiresIn = getTokenExpiresIn(tokenType);
  return jwt.sign(payload, tokenSecret, { expiresIn: tokenExpiresIn });
}

async function isTokenExpired(token: string, tokenType: TokenType): Promise<boolean> {
  try {
    await jwt.verify(token, getTokenSecret(tokenType));
    return false;
  } catch (err) {
    return true;
  }
}

async function verifyTokensInDatabase(accessToken: string, refreshToken: string, userId: string): Promise<boolean> {
  const accessTokenInDB = await tokenRepository.verifyTokenWithUserIdInDatabase(accessToken, userId, 'access');
  const refreshTokenInDB = await tokenRepository.verifyTokenWithUserIdInDatabase(refreshToken, userId, 'refresh');

  return accessTokenInDB && refreshTokenInDB;
}
async function verifyTokenInDatabase(token: string, userId: string, tokenType: TokenType): Promise<boolean> {
  return await tokenRepository.verifyTokenWithUserIdInDatabase(token, userId, tokenType);
}

async function clearAllTokenData(tokenData: {
  accessTokenDecoded: UserJwtPayload | null;
  refreshTokenDecoded: UserJwtPayload | null;
  refreshToken?: string;
  accessToken?: string;
}): Promise<number> {
  let numSessionsDeleted = 0;
  try {
    if (tokenData.accessTokenDecoded != null) {
      const profileId = tokenData.accessTokenDecoded.profileId;
      const userId = tokenData.accessTokenDecoded.userId;

      numSessionsDeleted += await tokenRepository.deleteTokenRecordsByUserId(userId);
      numSessionsDeleted += await tokenRepository.deleteTokenRecordsByProfileId(profileId);
    }
    if (tokenData.refreshTokenDecoded != null) {
      const profileId = tokenData.refreshTokenDecoded.profileId;
      const userId = tokenData.refreshTokenDecoded.userId;

      numSessionsDeleted += await tokenRepository.deleteTokenRecordsByUserId(userId);
      numSessionsDeleted += await tokenRepository.deleteTokenRecordsByProfileId(profileId);
    }
    if (tokenData.refreshToken != null) {
      const refreshToken = tokenData.refreshToken;

      numSessionsDeleted += await tokenRepository.deleteTokenRecordsByToken(refreshToken, 'refresh');
    }
    if (tokenData.accessToken != null) {
      const accessToken = tokenData.accessToken;

      numSessionsDeleted += await tokenRepository.deleteTokenRecordsByToken(accessToken, 'refresh');
    }
  } catch (error) {
    logger.error('Caught error during extensiveLogout forced repository calls.');
  }
  return numSessionsDeleted;
}

function attachTokenToResponse(token: string, tokenType: TokenType, res: Response) {
  if (tokenType === 'access') {
    logger.debug(`Setting access token as a cookie\n${token}`);
    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'strict',
    });
  }
  if (tokenType === 'refresh') {
    logger.debug(`Setting refresh token as a cookie\n${token}`);
    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'strict',
    });
  }
}

function getNumSecondsTokenIsValid(token: string): number {
  const decodedToken = jwt.decode(token) as UserJwtPayload | null;
  if (!decodedToken || !decodedToken.exp) {
    logger.error('Cannot decode token for calculating number of seconds the token is valid for.');
    throw new InternalServerError();
  }
  return decodedToken.exp - Math.floor(Date.now() / 1000);
}

const tokenService = {
  clearAllTokenData,
  attachTokenToResponse,
  getNumSecondsTokenIsValid,
  createToken,
  createNewAccessTokenFromRefreshToken,
  verifyTokenInDatabase,
  verifyTokensInDatabase,
  isTokenExpired,
};

export default tokenService;
