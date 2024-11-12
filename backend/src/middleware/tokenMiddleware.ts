import { Request, Response, NextFunction } from 'express';
import httpStatusCodes from 'http-status-codes';
import tokenService from '../servicesAndHelpers/auth/tokenService';
import logger from '../config/logger';

const tokenMiddleware = {
    authenticateToken: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        logger.debug('In tokenMiddleware.authenticateToken');
        
        const { accessToken, refreshToken } = req.cookies;

        // If no tokens are present, return Unauthorized status
        if (!accessToken && !refreshToken) {
            logger.debug('No access or refresh token found in cookies');
            res.sendStatus(httpStatusCodes.UNAUTHORIZED);
            return;
        }

        try {
            // If access token is provided, validate it
            if (accessToken) {
                const accessTokenDecoded = await tokenService.validateTokenAndPromiseDecode(accessToken, 'access');
                
                // If access token is invalid, try to refresh the access token using refresh token
                if (!accessTokenDecoded && refreshToken) {
                    return await handleRefreshToken(refreshToken, res, next);
                }

                // If access token is valid, proceed to next middleware
                if (accessTokenDecoded) {
                    return next();
                }
            }

            // If only refresh token is provided, attempt to refresh the access token
            if (refreshToken) {
                return await handleRefreshToken(refreshToken, res, next);
            }
        } catch (error) {
            logger.error('Error in authenticateToken middleware:', error);
            return next(error);
        }
    }
};

const handleRefreshToken = async (refreshToken: string, res: Response, next: NextFunction): Promise<void> => {
    try {
        const tokens = await refreshAccessTokenIfRefreshTokenIsValid(refreshToken);
        
        // If no new tokens could be obtained, return Unauthorized status
        if (!tokens) {
            res.sendStatus(httpStatusCodes.UNAUTHORIZED);
            return
        }

        // Attach new access token to response and proceed to the next middleware
        tokenService.attachTokensToResponse({ accessToken: tokens.accessToken }, res);
        return next();
    } catch (error) {
        logger.error('Error while handling refresh token:', error);
        return next(error);
    }
}


const refreshAccessTokenIfRefreshTokenIsValid = async (refreshToken: string): Promise<{ accessToken: string } | null> => {
    const refreshTokenDecoded = await tokenService.validateTokenAndPromiseDecode(refreshToken, 'refresh');
    
    if (!refreshTokenDecoded) {
        logger.debug('Refresh token is invalid');
        return null;
    }
    const newAccessToken = tokenService.createToken({ userId: refreshTokenDecoded.userId, profileId: refreshTokenDecoded.profileId }, 'access');
    await tokenService.updateAccessTokenInTokenTableWithNewAccessToken(refreshTokenDecoded.userId, newAccessToken);

    return { accessToken: newAccessToken };
}

export default tokenMiddleware;