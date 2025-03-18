import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';
import { UserJwtPayload } from '../types/auth/tokenTypes';
import { UnauthorizedError } from '../utils/errors/errors';
import tokenService from '../services/auth/tokenService';

const tokenMiddleware = {
  authenticateToken: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // Check if the environment variable to skip authentication is set
    if (process.env.SKIP_AUTH === 'true') {
      logger.debug('Skipping authentication due to environment variable');
      res.locals.isAuthenticated = true;
      next();
      return;
    }
    next();
    return;
  },
};

const validateProfileAndUserWithTokens = async (
  profileId: string,
  userId: string,
  decodedAccessToken: UserJwtPayload,
  decodedRefreshToken: UserJwtPayload
): Promise<void> => {
  logger.debug(
    `${profileId} = ${decodedAccessToken.profileId} = ${decodedRefreshToken.profileId}`
  );
  logger.debug(
    `${userId} = ${decodedAccessToken.userId} = ${decodedRefreshToken.userId}`
  );

  if (
    (decodedAccessToken && profileId !== decodedAccessToken.profileId) ||
    (decodedRefreshToken && profileId !== decodedRefreshToken.profileId) ||
    (decodedAccessToken && userId !== decodedAccessToken.userId) ||
    (decodedRefreshToken && userId !== decodedRefreshToken.userId)
  ) {
    logger.error('Mismatch between profileId, userId and token payload');
    throw new UnauthorizedError();
  }
};

export default tokenMiddleware;
