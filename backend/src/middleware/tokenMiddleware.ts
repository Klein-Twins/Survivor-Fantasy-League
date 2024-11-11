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
        const accessTokenHeader = req.headers['x-access-token'] as string;
        const accessToken = accessTokenHeader && accessTokenHeader.split(' ')[1];
        const refreshTokenHeader = req.headers['x-refresh-token'] as string;
        const refreshToken = refreshTokenHeader && refreshTokenHeader.split(' ')[1];

        logger.debug(`In authenticate token...`);

        try {
            //Access token is missing and refresh token is missing
            if (!accessToken && !refreshToken) {
                logger.debug(`No access token or refresh token attached to request`);
                return res.sendStatus(httpStatusCodes.UNAUTHORIZED);
            }
            else if (accessToken) {
                logger.debug(`Access token is in request.`)
                //TODO validate tokens against DB
                //const foundTokenRecord = await tokenService.findTokenRecordByAccessToken(accessToken);
                const accessTokenDecoded = await tokenService.validateTokenAndPromiseDecode(accessToken, 'access');
                if (!accessTokenDecoded) {
                    logger.debug(`Access token is invalid`);
                    if (refreshToken) {
                        logger.debug(`Refresh token is in request.`)
                        const refreshTokenDecoded = await tokenService.validateTokenAndPromiseDecode(refreshToken, 'refresh');
                        //Access token is invalid and refresh token is invalid
                        if (!refreshTokenDecoded) {
                            logger.debug(`Refresh token is invalid`);
                            return res.sendStatus(httpStatusCodes.UNAUTHORIZED);
                        }
                        //Access token is invalid and refresh token is valid
                        else {
                            logger.debug(`Refresh token is valid - creating new access token`);
                            const newAccessToken = tokenService.createAccessToken({userId: refreshTokenDecoded.userId});
                            await tokenService.updateAccessTokenInTokenTableWithNewAccessToken(refreshTokenDecoded.userId, accessToken);
                            res.set('X-Access-Token', `Bearer ${newAccessToken}`)
                               .set('X-Refresh-Token', `Bearer ${refreshToken}`)
                            return next();
                        }
                    }
                    //Access token is invalid and refresh token is missing
                    else {
                        logger.debug(`Refresh token is not in request`);
                        return res.sendStatus(httpStatusCodes.UNAUTHORIZED);
                    }
                }
                //Access token is valid
                else {
                    logger.debug(`Access token is valid`);
                    return next();
                }
            } else if (refreshToken) {
                logger.debug(`Refresh token is in request and access token is not in request`);
                const decodedRefreshToken = await tokenService.validateTokenAndPromiseDecode(refreshToken, 'refresh');
                //Refresh token is invalid
                if (!decodedRefreshToken) {
                    logger.debug(`Refresh token is invalid and access token is not in request`);
                    return res.sendStatus(httpStatusCodes.UNAUTHORIZED);
                }
                //Refresh token is valid
                else {
                    logger.debug(`Refresh token is valid and access token is not in the request`);
                    logger.debug(`Access token is invalid and refresh token is valid`);
                    const newAccessToken = tokenService.createAccessToken({userId : decodedRefreshToken.userId});
                    await tokenService.updateAccessTokenInTokenTableWithNewAccessToken(decodedRefreshToken.userId, accessToken);
                    res.set('X-Access-Token', `Bearer ${newAccessToken}`)
                       .set('X-Refresh-Token', `Bearer ${refreshToken}`)
                    return next();
                }
            }
        } catch (error) {
            logger.error(`Caught error in authenticate token...`);
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

export default tokenMiddleware;