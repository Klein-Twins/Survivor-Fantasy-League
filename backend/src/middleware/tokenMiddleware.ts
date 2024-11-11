import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import tokenService, { UserJwtPayload } from '../servicesAndHelpers/auth/tokenService';
import errorFactory from '../utils/errors/errorFactory';
import { INTERNAL_SERVER_ERROR } from '../constants/auth/responseErrorConstants';
import logger from '../config/logger';
import { Account } from '../types/auth/authTypes';
import httpStatusCodes from 'http-status-codes';
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from '../config/config';


const tokenMiddleware = {
    authenticateToken: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        const accessToken = req.headers['x-access-token']?.split(' ')[1];
        const refreshToken = req.headers['x-refresh-token']?.split(' ')[1];

        // Helper to handle unauthorized response with logging
        const handleUnauthorized = (res : Response, message: string) => {
            logger.debug(message);
            return res.sendStatus(httpStatusCodes.UNAUTHORIZED);
        };
    
        try {
            if (!accessToken && !refreshToken) {
                logger.debug('No access token or refresh token attached to request');
                return res.sendStatus(httpStatusCodes.UNAUTHORIZED);
            }
    
            if (accessToken) {
                logger.debug('Access token is in request.');
                const accessTokenDecoded = await tokenService.validateTokenAndPromiseDecode(accessToken, 'access');
                
                if (!accessTokenDecoded) {
                    logger.debug('Access token is invalid');
                    
                    if (refreshToken) {
                        const refreshHandled = await handleRefreshToken(refreshToken, res, next);
                        if (refreshHandled === null) {
                            return handleUnauthorized(res, 'Refresh token is invalid');
                        }
                    } else {
                        return handleUnauthorized(res, 'Refresh token is missing');
                    }
                } else {
                    logger.debug('Access token is valid');
                    return next();
                }
            } else if (refreshToken) {
                logger.debug('Only refresh token is present');
                const refreshHandled = await handleRefreshToken(refreshToken, res, next);
                if (refreshHandled === null) {
                    return handleUnauthorized(res, 'Refresh token is invalid');
                }
            }
        } catch (error) {
            logger.error('Caught error in authenticate token...');
            next(error);
        }
    },

    generateTokensAfterSignupOrLogin: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const account: Account = res.locals.account;
            logger.debug(account);

            if (!account) {
                logger.error("Account data missing for token generation");
                throw errorFactory(INTERNAL_SERVER_ERROR);
            }

            const accessToken = tokenService.createAccessToken({ userId: account.userId });
            const refreshToken = tokenService.createRefreshToken({ userId: account.userId });

            await tokenService.deleteTokenRecordsByUserId(account.userId);
            await tokenService.createTokenRecordWithAccessAndRefreshTokens(accessToken, refreshToken, account.userId);

            // Set the Authorization header with the generated token
            res
                .set("X-Access-Token", `Bearer ${accessToken}`)
                .set("X-Refresh-Token", `Bearer ${refreshToken}`)
                .status(httpStatusCodes.ACCEPTED)
                .json({
                    account
                });
        } catch (error) {
            next(error);
        }
    }
};

//Helper function to handle refresh token logic.
const handleRefreshToken = async (refreshToken: string, res: Response, next: NextFunction): Promise<null | void> => {
    const refreshTokenDecoded = await tokenService.validateTokenAndPromiseDecode(refreshToken, 'refresh');
    
    if (!refreshTokenDecoded) {
        logger.debug('Refresh token is invalid');
        return null; // Explicitly return null if refresh token validation fails
    }

    logger.debug('Refresh token is valid - creating new access token');
    const newAccessToken = tokenService.createAccessToken({ userId: refreshTokenDecoded.userId });
    
    await tokenService.updateAccessTokenInTokenTableWithNewAccessToken(refreshTokenDecoded.userId, newAccessToken);

    res.set('X-Access-Token', `Bearer ${newAccessToken}`)
       .set('X-Refresh-Token', `Bearer ${refreshToken}`);
    
    return next();
};

export default tokenMiddleware;