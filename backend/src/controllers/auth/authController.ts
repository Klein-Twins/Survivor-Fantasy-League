import { Request, Response, NextFunction } from "express";
import httpStatusCodes from 'http-status-codes';

import { Account, LoginRequestFields } from "../../types/auth/authTypes";
import authService from "../../servicesAndHelpers/auth/authService";
import logger from "../../config/logger";
import tokenService from "../../servicesAndHelpers/auth/tokenService";
import { formatLoginRequest, validateLoginRequest } from "../../utils/auth/authUtils";
import errorFactory from "../../utils/errors/errorFactory";
import { UserJwtPayload } from "../../types/auth/tokenTypes";
import { LOGOUT_MESSAGE } from "../../constants/auth/responseErrorConstants";

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

            res.locals.message = "User logged in successfully"
            res.locals.account = account;
            res.status(200);
            next();
        } catch (error) {
            logger.error(`Error in authController.login: ${error}`);
            next(error);
        }
    },

    authenticatedLogout: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const numSessionsDeleted = await authService.logout(req, res, next, true);
            if (numSessionsDeleted === 1) {
                logger.debug(`Cleared ${numSessionsDeleted} session`)
            } else {
                logger.warn(`Cleared ${numSessionsDeleted} session(s).`);
            }
            res.status(httpStatusCodes.OK).json({ message: LOGOUT_MESSAGE });
        } catch (error) {
            logger.error("Caught error in authController.authenticatedLogout()")
            next(error);
        }
    },

    unauthenticatedlogout: async (err: any, req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const numSessionsDeleted = await authService.logout(req, res, next, false);
            if (numSessionsDeleted === 1) {
                logger.debug(`Cleared ${numSessionsDeleted} session`)
            } else {
                logger.warn(`Cleared ${numSessionsDeleted} session(s).`);
            }
            res.status(httpStatusCodes.OK).json({ message: LOGOUT_MESSAGE });
        } catch (error) {
            logger.error("Caught error in authController.unauthenticatedlogout()")
            next(error);
        }
    }
};
export default authController;