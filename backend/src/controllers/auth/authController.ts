import { Request, Response, NextFunction } from "express";
import httpStatusCodes from 'http-status-codes';

import { Account, LoginRequestFields } from "../../types/auth/authTypes";
import authService from "../../servicesAndHelpers/auth/authService";
import logger from "../../config/logger";
import tokenService from "../../servicesAndHelpers/auth/tokenService";
import { formatLoginRequest, validateLoginRequest } from "../../utils/auth/authUtils";
import errorFactory from "../../utils/errors/errorFactory";

/**
 * Controller for handling authentication actions.
 */
const authController = {

    login: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            logger.debug("Login Request received.");

            // Destructure login data
            const { email, password }: LoginRequestFields = req.body;

            // Validate and format request data
            validateLoginRequest({ email, password });
            const formattedLoginRequestData = formatLoginRequest({ email, password });

            // Get account
            const account: Account | null = await authService.login(formattedLoginRequestData);
            if (!account) {
                throw errorFactory({ statusCode: 500 })
            }

            res.locals.account = account;
            next();
        } catch (error) {
            logger.error(`Error in authController.login: ${error}`);
            next(error);
        }
    },

    logout: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const accessToken: string | undefined = req.cookies.accessToken;
            const refreshToken: string | undefined = req.cookies.refreshToken;

            // Clear cookies
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');

            // If no refresh token is present, end the response
            if (!refreshToken) {
                res.sendStatus(httpStatusCodes.OK);
                return;
            }

            const foundRefreshToken = await tokenService.findTokenRecordByRefreshToken(refreshToken);

            if (!foundRefreshToken) {
                res.sendStatus(httpStatusCodes.OK);
                logger.warn('Refresh token was not found in database.')
                return
            }

            await tokenService.deleteTokenRecordsByRefreshToken(refreshToken);
            res.sendStatus(httpStatusCodes.OK);
        } catch (error) {
            logger.error(`Error in logout: ${error}`);
            res.sendStatus(httpStatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
};
export default authController;