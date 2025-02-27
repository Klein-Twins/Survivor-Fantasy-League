import { Response } from 'express';
import { Account, UserSession } from '../../generated-api';
import tokenService from './tokenService';
import logger from '../../config/logger';
import { NODE_ENV } from '../../config/config';
import { TokenType } from '../../types/auth/tokenTypes';
import userSessionHelper from '../../helpers/auth/userSessionHelper';

const userSessionService = {
  createUserSession,
  endCurrentUserSession,
  getCurrentUserSession,
};

async function getCurrentUserSession(
  accessToken: string,
  refreshToken: string
): Promise<UserSession> {
  if (!accessToken || !refreshToken) {
    return { isAuthenticated: false, numSecondsRefreshTokenExpiresIn: 0 };
  }

  // //TODO: May not need this as authorization middleware should cover authenticity of tokens with database.
  // const accessTokenPayload = await tokenService.decodeToken(accessToken);
  // const refreshTokenPayload = await tokenService.decodeToken(refreshToken);

  // const dbTokensFromAccessToken = await tokenService.getActiveTokens(
  //   accessTokenPayload.userId
  // );
  // const dbTokensFromRefreshToken = await tokenService.getActiveTokens(
  //   refreshTokenPayload.userId
  // );

  // if (
  //   dbTokensFromAccessToken.dbAccessToken !==
  //     dbTokensFromRefreshToken.dbAccessToken ||
  //   dbTokensFromAccessToken.dbRefreshToken !==
  //     dbTokensFromRefreshToken.dbRefreshToken
  // ) {
  //   throw new ForbiddenError('Invalid tokens');
  // }

  return await userSessionHelper.buildUserSession(refreshToken);
}

async function createUserSession(
  account: Account,
  response: Response
): Promise<UserSession> {
  const tokens = await tokenService.createTokens(account);
  attachTokensToResponse(tokens, response);
  return await userSessionHelper.buildUserSession(tokens.refreshToken);
}

async function endCurrentUserSession(
  response: Response,
  refreshToken: string,
  accessToken: string
): Promise<void> {
  response.clearCookie('accessToken');
  response.clearCookie('refreshToken');
  await tokenService.setTokensToInactive(accessToken, refreshToken);
}

function attachTokensToResponse(
  tokens: { accessToken: string; refreshToken: string },
  res: Response
): void {
  attachTokenToResponse(tokens.accessToken, 'access', res);
  attachTokenToResponse(tokens.refreshToken, 'refresh', res);
}

function attachTokenToResponse(
  token: string,
  tokenType: TokenType,
  res: Response
): void {
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

export default userSessionService;
