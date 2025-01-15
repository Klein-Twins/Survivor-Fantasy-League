import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';
import tokenService from '../servicesAndHelpers/auth/tokenService';
import errorFactory from '../utils/errors/errorFactory';
import { UNAUTHORIZED_ERROR } from '../constants/auth/responseErrorConstants';
import { UserJwtPayload } from '../types/auth/tokenTypes';
import authService from '../servicesAndHelpers/auth/authService';

const tokenMiddleware = {
    authenticateToken: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        logger.debug('In tokenMiddleware.authenticateToken');

        // Check if the environment variable to skip authentication is set
        if (process.env.SKIP_AUTH === 'true') {
            logger.debug('Skipping authentication due to environment variable');
            res.locals.isAuthenticated = true;
            return next();
        }

        const accessToken: string = req.cookies.accessToken;
        const refreshToken: string = req.cookies.refreshToken;
        const profileId = req.query.profileId as string;

        try {

            await authService.authenticateTokens({ profileId, accessToken, refreshToken }, res)
            logger.debug('Tokens are valid. Proceeding with the request.');
            res.locals.isAuthenticated = true;
            next();

        } catch (error) {
            logger.error('Error in authenticateToken middleware:', error);
            res.locals.isAuthenticated = false;
            return next(error);
        }
    }
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


export default tokenMiddleware;