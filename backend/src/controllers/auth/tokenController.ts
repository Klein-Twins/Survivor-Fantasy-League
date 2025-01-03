import { Request, Response, NextFunction } from "express";
import httpStatusCodes from 'http-status-codes';

import { Account, AccountForResponses } from "../../types/auth/authTypes";

import logger from "../../config/logger";

import accountService from "../../servicesAndHelpers/auth/accountService";
import tokenService from "../../servicesAndHelpers/auth/tokenService";
import errorFactory from "../../utils/errors/errorFactory";
import { INTERNAL_SERVER_ERROR, UNAUTHORIZED_ERROR } from "../../constants/auth/responseErrorConstants";
import userService from "../../servicesAndHelpers/user/userService";
import authService from "../../servicesAndHelpers/auth/authService";

const tokenController = {
    extendSessionByRefreshingTokens: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        logger.debug('Attempting to refresh tokens');

        try {
            const profileId = req.query.profileId as string;
            const userId = await userService.getUserIdByProfileId(profileId);

            if (!profileId || !userId) {
                logger.error("Cannot extend session. Missing profileId from query Parameters or profileId is not tied to a userId");
                throw errorFactory(UNAUTHORIZED_ERROR);
            }

            const { refreshToken } = await tokenService.createAndAttachTokensToResponse(userId, profileId, res);
            const numSecondsTokenIsValid = tokenService.numSecondsTokenIsValid(refreshToken);

            res.status(httpStatusCodes.ACCEPTED).json({ message: 'User session extended successfully.', numSecondsRefreshTokenExpiresIn: numSecondsTokenIsValid });
        } catch (error) {
            logger.error(`Error refreshing tokens: ${error}`);
            next(error);
        }
    },

    checkIsAuthenticated: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        logger.debug("Checking if authenticated.");
        const accessToken: string | undefined = req.cookies.accessToken;
        const refreshToken: string | undefined = req.cookies.refreshToken;
        const profileId = req.query.profileId as string;

        try {
            await authService.authenticateTokens({ profileId, accessToken, refreshToken }, res)

            const account: Account | null = await accountService.getAccount({ profileId });
            if (!account) {
                logger.error("Cannot retrieve account for authenticated session.");
                throw errorFactory(INTERNAL_SERVER_ERROR);
            }

            const accountForResponse: AccountForResponses = accountService.getAccountForResponse(account);
            const numSecondsTokenIsValid = tokenService.numSecondsTokenIsValid(refreshToken as string);

            res.json({
                isAuthenticated: true,
                account: accountForResponse,
                numSecondsRefreshTokenExpiresIn: numSecondsTokenIsValid,
                message: 'User is authenticated'
            });

        } catch (error) {
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            res.json({ isAuthenticated: false });
        }
    },

    createSession: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        logger.debug('Creating a new user session.');
        try {
            const account: Account | undefined = res.locals.account;
            const message: string = res.locals.message || "Success";
            if (!account) {
                logger.error("Missing account data for token generation");
                throw errorFactory(INTERNAL_SERVER_ERROR);
            }

            const { refreshToken } = await tokenService.createAndAttachTokensToResponse(account.userId, account.profileId, res);

            const numSecondsTokenIsValid = tokenService.numSecondsTokenIsValid(refreshToken);
            const accountResponse = accountService.getAccountForResponse(account);

            logger.debug("Session created successfully, sending response");

            res.json({ message, account: accountResponse, numSecondsRefreshTokenExpiresIn: numSecondsTokenIsValid, isAuthenticated: true });
        } catch (error) {
            next(error);
        }
    },
}

export default tokenController;