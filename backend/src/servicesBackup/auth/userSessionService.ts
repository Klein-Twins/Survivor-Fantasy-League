import { Response } from 'express';
import { AccountRole, UserSession } from '../../generated-api';
import { ProfileAttributes } from '../../models/account/Profile';
import { UserAttributes } from '../../models/account/User';
import tokenService from './tokenService';
import { TokenAttributes, TokenType } from '../../models/account/Tokens';
import { NODE_ENV } from '../../config/config';
import userSessionHelper from '../../helpers/auth/userSessionHelper';
import { UnauthorizedError } from '../../utils/errors/errors';

const userSessionService = {
  createUserSession,
  endUserSession,
  extendSession,
  checkAuthSession,
};

async function createUserSession(
  {
    userId,
    profileId,
    accountRole,
  }: {
    userId: UserAttributes['userId'];
    profileId: ProfileAttributes['profileId'];
    accountRole: AccountRole;
  },
  response: Response
): Promise<UserSession> {
  const tokens = await tokenService.createTokens({
    userId,
    profileId,
    accountRole,
  });

  attachTokenToResponse(tokens.accessToken, 'access', response);
  attachTokenToResponse(tokens.refreshToken, 'refresh', response);

  return userSessionHelper.buildUserSession(tokens.refreshToken);
}

async function checkAuthSession(
  userId: UserAttributes['userId'],
  tokens: {
    accessToken: string;
    refreshToken: string;
  },
  res: Response
): Promise<UserSession> {
  const decoded = await tokenService.validateTokens(tokens, {
    checkAccessTokenHasExpired: false,
    checkRefreshTokenHasExpired: true,
    checkAccessTokenInDBAndMarkedActive: false,
    checkRefreshTokenInDBAndMarkedActive: true,
    checkTokensBelongToUser: userId || null,
  });

  if (!decoded) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return {
      isAuthenticated: false,
    };
  } else {
    return userSessionHelper.buildUserSession(tokens.refreshToken);
  }
}

async function extendSession(
  tokens: {
    accessToken: TokenAttributes['token'];
    refreshToken: TokenAttributes['token'];
  },
  response: Response,
  userId?: UserAttributes['userId']
): Promise<UserSession> {
  const tokenPayload = await tokenService.validateTokens(tokens, {
    checkAccessTokenHasExpired: true,
    checkRefreshTokenHasExpired: true,
    checkAccessTokenInDBAndMarkedActive: true,
    checkRefreshTokenInDBAndMarkedActive: true,
    checkTokensBelongToUser: userId || null,
  });

  if (!tokenPayload) {
    throw new UnauthorizedError('Unauthorized');
  }

  await tokenService.invalidateTokens(
    tokens.accessToken,
    tokens.refreshToken,
    !!tokenPayload
  );

  return await createUserSession(
    {
      userId: tokenPayload.userId,
      profileId: tokenPayload.profileId,
      accountRole: tokenPayload.accountRole,
    },
    response
  );
}

async function endUserSession(
  {
    accessToken,
    refreshToken,
  }: {
    accessToken: TokenAttributes['token'];
    refreshToken: TokenAttributes['token'];
  },
  wereTokensValidated: boolean,
  response: Response
) {
  response.clearCookie('accessToken');
  response.clearCookie('refreshToken');

  await tokenService.invalidateTokens(
    accessToken,
    refreshToken,
    wereTokensValidated
  );
}

function attachTokenToResponse(
  token: string,
  tokenType: TokenType,
  res: Response
): void {
  if (tokenType === 'access') {
    //logger.debug(`Setting access token as a cookie\n${token}`);
    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'strict',
    });
  }
  if (tokenType === 'refresh') {
    //logger.debug(`Setting refresh token as a cookie\n${token}`);
    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'strict',
    });
  }
}

export default userSessionService;
