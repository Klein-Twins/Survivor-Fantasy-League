import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../utils/errors/errors';
import { TokenHelper } from '../helpers/account/TokenHelper';
import { container } from 'tsyringe';
import validator from 'validator';
import logger from '../config/logger';
import { AccountService } from '../services/account/AccountService';
import { UserSessionService } from '../services/account/UserSessionService';
import { NODE_ENV } from '../config/config';

const authenticateApiCall = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (NODE_ENV === 'test') {
      // In test environment, skip authentication
      logger.info('Skipping authentication in test environment.');
      return next();
    }

    logger.apiOp('Validating user session for API use.');
    const accessToken = req.cookies['accessToken'];
    const refreshToken = req.cookies['refreshToken'];

    validateTokens(accessToken, refreshToken);

    const tokenHelper = container.resolve(TokenHelper);
    const decodedAccessToken = tokenHelper.decodeToken(accessToken);
    const decodedRefreshToken = tokenHelper.decodeToken(refreshToken);

    validateTokenPayloads(tokenHelper, decodedAccessToken, decodedRefreshToken);

    const account = await container
      .resolve(AccountService)
      .fetchAccount('accountId', decodedRefreshToken.userId);

    const userSession = account.getActiveUserSession();
    if (!userSession) {
      logger.warn('User attempted to access API with invalid session.');
      throw new UnauthorizedError('Unauthorized. Please login again.');
    }

    const userSessionAccessToken = userSession
      .getActiveAccessToken()
      ?.getToken();
    const userSessionRefreshToken = userSession
      .getActiveRefreshToken()
      ?.getToken();

    if (userSessionAccessToken !== accessToken) {
      logger.warn(
        'Active access token of user session does not match access token in request.'
      );
      throw new UnauthorizedError('Unauthorized. Please login again.');
    }

    if (userSessionRefreshToken !== refreshToken) {
      logger.warn(
        'Active refresh token of user session does not match refresh token in request.'
      );
      throw new UnauthorizedError('Unauthorized. Please login again.');
    }

    // Check if the refresh token is expired
    if (tokenHelper.isTokenExpired(refreshToken, 'refresh')) {
      logger.warn('User attempted to access API with expired refresh token.');
      throw new UnauthorizedError('Unauthorized. Please login again.');
    }

    if (tokenHelper.isTokenExpired(accessToken, 'access')) {
      logger.warn(
        'Access token is expired but refresh token is valid. Refreshing access token.'
      );
      container
        .resolve(UserSessionService)
        .refreshAccessTokenOnUserSession(userSession);

      res.cookie(
        'accessToken',
        userSession.getActiveAccessToken()?.getToken(),
        {
          httpOnly: true,
          secure: NODE_ENV === 'production',
          sameSite: 'strict',
        }
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};

function validateTokens(accessToken: string, refreshToken: string): void {
  if (!accessToken || !refreshToken) {
    logger.warn('User attempted to access API without tokens.');
    throw new UnauthorizedError('Unauthorized. Please login again.');
  }

  if (!validator.isJWT(accessToken) || !validator.isJWT(refreshToken)) {
    logger.warn('User attempted to access API with invalid tokens.');
    throw new UnauthorizedError('Unauthorized. Please login again.');
  }
}

function validateTokenPayloads(
  tokenHelper: TokenHelper,
  decodedAccessToken: any,
  decodedRefreshToken: any
): void {
  if (
    !tokenHelper.validateTokenPayloadsEqual(
      decodedAccessToken,
      decodedRefreshToken
    )
  ) {
    logger.warn(
      'User attempted to access API with tokens of unequal payloads.'
    );
    throw new UnauthorizedError('Unauthorized. Please login again.');
  }
}

function validateUserSession(
  userSession: any,
  accessToken: string,
  refreshToken: string
): void {
  if (!userSession) {
    logger.warn('User attempted to access API with invalid session.');
    throw new UnauthorizedError('Unauthorized. Please login again.');
  }

  const userSessionAccessToken = userSession.getActiveAccessToken()?.getToken();
  const userSessionRefreshToken = userSession
    .getActiveRefreshToken()
    ?.getToken();

  if (userSessionAccessToken !== accessToken) {
    logger.warn(
      'Active access token of user session does not match access token in request.'
    );
    throw new UnauthorizedError('Unauthorized. Please login again.');
  }

  if (userSessionRefreshToken !== refreshToken) {
    logger.warn(
      'Active refresh token of user session does not match refresh token in request.'
    );
    throw new UnauthorizedError('Unauthorized. Please login again.');
  }

  if (userSession.getActiveRefreshToken()?.isExpired()) {
    logger.warn('User attempted to access API with expired refresh token.');
    throw new UnauthorizedError('Unauthorized. Please login again.');
  }
}

export default authenticateApiCall;
