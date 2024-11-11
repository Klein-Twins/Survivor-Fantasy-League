import { Request, Response, NextFunction } from "express";
import httpStatusCodes from 'http-status-codes';

import { Account, AccountForResponses, LoginRequestFields } from "../../types/auth/authTypes";
import { isValidEmail } from "../../servicesAndHelpers/auth/authHelper";
import errorFactory from "../../utils/errors/errorFactory";
import authService from "../../servicesAndHelpers/auth/authService";
import logger from "../../config/logger";
import tokenService from "../../servicesAndHelpers/auth/tokenService";
import { INVALID_EMAIL_ERROR, LOGIN_FAILED_ERROR, MISSING_EMAIL_ERROR, MISSING_PASSWORD_ERROR } from "../../constants/auth/responseErrorConstants";

/**
 * Controller for handling authentication actions.
 */
const authController = {

    login: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            logger.debug("Login Request received.")

            //Extract login data
            const loginRequestData: LoginRequestFields = {
                email: req.body.email,
                password: req.body.password,
            };

            //Validate and format request data
            validateLoginRequest(loginRequestData);
            const formattedLoginRequestData = formatLoginRequest(loginRequestData);

            //Get account
            const account: Account = await authService.login(formattedLoginRequestData);
            if(!account) {
                throw errorFactory(LOGIN_FAILED_ERROR);
            }

            res.locals.account = account;
            next();
        } catch (error) {
            logger.error(`Error in authController.login: ${error}`)
            next(error);
        }
    },

    logout: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const accessToken = req.cookies.accessToken;
            const refreshToken = req.cookies.refreshToken;


            const foundRefreshToken = tokenService.findTokenRecordByRefreshToken(refreshToken);

            if(!foundRefreshToken) {
                return res.sendStatus(httpStatusCodes.NO_CONTENT);
            }
            await tokenService.deleteTokenRecordsByRefreshToken(refreshToken);
            return res.sendStatus(httpStatusCodes.NO_CONTENT)
        }
        catch (error) {
            next(error);
        }
    },

    refreshTokens: async (req : Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            logger.debug('In authController.refreshTokens');

            const refreshToken = req.cookies.refreshToken;
            logger.debug(`Refresh Token: ${refreshToken}`);
            
            if(!refreshToken) {
                return res.sendStatus(httpStatusCodes.UNAUTHORIZED)
            }

            //const foundTokenRecord = await tokenService.findTokenRecordByRefreshToken(refreshToken);
 

            const decodedRefreshToken = await tokenService.validateTokenAndPromiseDecode(refreshToken, 'refresh');
            if(decodedRefreshToken) {
                /*
                if(!foundTokenRecord) {
                    logger.warn(`Valid Refresh token is not in the database. Reuse or tampering detected.`);
                    return res.sendStatus(httpStatusCodes.FORBIDDEN);
                }
                logger.debug(`Refresh token is found in database`);
                */
                const newAccessToken = tokenService.createAccessToken(decodedRefreshToken);
                const newRefreshToken = tokenService.createRefreshToken(decodedRefreshToken);
                tokenService.attachTokensToResponse({accessToken: newAccessToken, refreshToken: newRefreshToken}, res);
                return res.status(httpStatusCodes.ACCEPTED).send({message: 'Session extended'})
            } else {
                return res.sendStatus(httpStatusCodes.UNAUTHORIZED);
            }
        } catch(error) {
            logger.error(`Unexpected error for refreshtToken endpoint ${error}`)
            next(error)
        }
    }
};

/**
 * Validates login request data, checking for a valid email and non-empty password.
 * Throws an error if validation fails.
 * 
 * @param loginRequestData - Object containing the email and password from the login request
 * @throws Will throw an error if email is invalid or if email/password are missing
 */
const validateLoginRequest = (loginRequestData: LoginRequestFields): void => {
    if (!loginRequestData.email || loginRequestData.email.length === 0) {
        throw errorFactory(MISSING_EMAIL_ERROR);
    }
    if (!isValidEmail(loginRequestData.email)) {
        throw errorFactory(INVALID_EMAIL_ERROR);
    }
    if (!loginRequestData.password || loginRequestData.password.length === 0) {
        throw errorFactory(MISSING_PASSWORD_ERROR);
    }
};

/**
 * Formats the login request data by converting the email to lowercase.
 * 
 * @param loginRequestData - Object containing the email and password from the login request
 * @returns A new object with the email in lowercase and the original password
 */
const formatLoginRequest = (loginRequestData: LoginRequestFields): LoginRequestFields => ({
    ...loginRequestData,
    email: loginRequestData.email.toLowerCase(),
});

export default authController;