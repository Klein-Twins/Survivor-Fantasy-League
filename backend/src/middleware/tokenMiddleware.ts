import { Request, Response, NextFunction } from 'express';
import httpStatusCodes from 'http-status-codes';

import tokenService from '../servicesAndHelpers/auth/tokenService';
import errorFactory from '../utils/errors/errorFactory';
import { INTERNAL_SERVER_ERROR } from '../constants/auth/responseErrorConstants';
import logger from '../config/logger';
import { Account, AccountForResponses } from '../types/auth/authTypes';
import accountService from '../servicesAndHelpers/auth/accountService';

const tokenMiddleware = {
    authenticateToken: async (req: Request, res: Response, next: NextFunction): Promise<any> => {

        logger.debug('In tokenMiddleware.authenticateToken')

        const accessToken = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;
    
        try {
            if (!accessToken && !refreshToken) {
                logger.debug('No access token cookie or refresh token cookie attached to request');
                return res.sendStatus(httpStatusCodes.UNAUTHORIZED);
            }

            if (accessToken) {
                const accessTokenDecoded = await tokenService.validateTokenAndPromiseDecode(accessToken, 'access');
                
                if (!accessTokenDecoded) {
                    if (refreshToken) {
                        const tokens = await tokenService.refreshAccessTokenIfNeeded(refreshToken);
                        if (!tokens) {
                            return res.sendStatus(httpStatusCodes.UNAUTHORIZED);
                        }
                        tokenService.attachTokensToResponse({accessToken: tokens.accessToken}, res)
                        return next();
                    }
                    return res.sendStatus(httpStatusCodes.UNAUTHORIZED);
                }
                return next();
            }

            if (refreshToken) {
                const tokens = await tokenService.refreshAccessTokenIfNeeded(refreshToken);
                if (!tokens) {
                    return res.sendStatus(httpStatusCodes.UNAUTHORIZED);
                }
                tokenService.attachTokensToResponse({accessToken: tokens.accessToken}, res)
                return next();
            }
        } catch (error) {
            logger.error('Caught error in authenticate token...');
            next(error);
        }
    },

    generateTokensAfterSignupOrLogin: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const account: Account = res.locals.account;

            if (!account) {
                logger.error("Account data missing for token generation");
                throw errorFactory(INTERNAL_SERVER_ERROR);
            }

            await tokenService.createAndAttachTokens(account.userId, account.profileId, res);

            res.status(httpStatusCodes.ACCEPTED).json({ account: accountService.getAccountForResponse(account) });
        } catch (error) {
            next(error);
        }
    }
};

export default tokenMiddleware;