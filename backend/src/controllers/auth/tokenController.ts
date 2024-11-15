import { Request, Response, NextFunction } from "express";
import httpStatusCodes from 'http-status-codes';
import jwt from 'jsonwebtoken';

import { Account } from "../../types/auth/authTypes";
import { UserJwtPayload } from "../../types/auth/tokenTypes";
import { JWT_REFRESH_SECRET } from "../../config/config";

import logger from "../../config/logger";

import accountService from "../../servicesAndHelpers/auth/accountService";
import tokenService from "../../servicesAndHelpers/auth/tokenService";
import errorFactory from "../../utils/errors/errorFactory";

const tokenController = {
    extendSessionByRefreshingAccessAndRefreshTokens: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        logger.debug('Attempting to refresh tokens');

        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            res.sendStatus(httpStatusCodes.UNAUTHORIZED);
            return;
        }

        try {
            const decodedRefreshToken = await tokenService.validateTokenAndPromiseDecode(refreshToken, 'refresh');
            if (!decodedRefreshToken) {
                res.sendStatus(httpStatusCodes.UNAUTHORIZED);
                return;
            }

            const newAccessToken = tokenService.createToken(decodedRefreshToken, 'access');
            const newRefreshToken = tokenService.createToken(decodedRefreshToken, 'refresh');
            tokenService.attachTokensToResponse({ accessToken: newAccessToken, refreshToken: newRefreshToken }, res);
            res.status(httpStatusCodes.ACCEPTED).json({ message: 'Session extended' });
        } catch (error) {
            logger.error(`Error refreshing tokens: ${error}`);
            next(error);
        }
    },

    getRefreshTokenExpiresIn: (req: Request, res: Response): void => {
        logger.debug('Checking refresh token expiration');

        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            logger.error('Refresh token missing in request');
            res.status(httpStatusCodes.UNAUTHORIZED).json({ message: 'Refresh token not found' });
            return;
        }

        try {
            const decoded = jwt.decode(refreshToken) as UserJwtPayload | null;
            if (!decoded?.exp) {
                logger.debug('Invalid refresh token');
                res.status(httpStatusCodes.BAD_REQUEST).json({ message: 'Invalid refresh token' });
                return;
            }

            const remainingTime = decoded.exp - Math.floor(Date.now() / 1000);
            logger.debug(`Remaining refresh token time: ${remainingTime} seconds`);
            res.status(httpStatusCodes.OK).json({ remainingTime });
        } catch (error) {
            logger.error(`Error decoding refresh token: ${error}`);
            res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to decode refresh token' });
        }
    },

    checkIsAuthenticated: (req: Request, res: Response): void => {
        logger.debug('Checking authentication status of refresh token');

        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            res.json({ isAuthenticated: false });
            return;
        }

        try {
            jwt.verify(refreshToken, JWT_REFRESH_SECRET);
            res.json({ isAuthenticated: true });
        } catch {
            res.json({ isAuthenticated: false });
        }
    },

    generateTokensAfterSignupOrLogin: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const account: Account | undefined = res.locals.account;
            if (!account) {
                logger.error("Missing account data for token generation");
                throw errorFactory({ statusCode: 500 })
            }

            await tokenService.createAndAttachTokensToResponse(account.userId, account.profileId, res);
            const accountResponse = accountService.getAccountForResponse(account);
            res.status(httpStatusCodes.ACCEPTED).json({ message: "User signed up successfully", account: accountResponse });
        } catch (error) {
            next(error);
        }
    },
}

export default tokenController;