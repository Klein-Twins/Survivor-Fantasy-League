import { Request, Response, NextFunction } from "express";
import httpStatusCodes from 'http-status-codes';
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

import { Account, LoginRequestFields } from "../../types/auth/authTypes";
import { isValidEmail } from "../../servicesAndHelpers/auth/authHelper";
import errorFactory from "../../utils/errors/errorFactory";
import authService from "../../servicesAndHelpers/auth/authService";
import logger from "../../config/logger";
import tokenService from "../../servicesAndHelpers/auth/tokenService";
import { INVALID_EMAIL_ERROR, MISSING_EMAIL_ERROR, MISSING_PASSWORD_ERROR } from "../../constants/auth/responseErrorConstants";
import { JWT_REFRESH_SECRET } from "../../config/config";
import { ForbiddenError } from "../../utils/errors/errors";

/**
 * Controller for handling authentication actions.
 */
const authController = {

    login: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const loginRequestData: LoginRequestFields = {
                email: req.body.email,
                password: req.body.password,
            };

            validateLoginRequest(loginRequestData);
            logger.debug("Login Request fields validated")
            const formattedLoginRequestData = formatLoginRequest(loginRequestData);

            const account: Account = await authService.login(formattedLoginRequestData);
            res.locals.account = account;

            next();
        } catch (error) {
            next(error);
        }
    },

    logout: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const refreshTokenHeader = req.headers['X-Refresh-Token'] as string;
            const refreshToken = refreshTokenHeader && refreshTokenHeader.split(' ')[1];

            //is refresh token in db
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
            const refreshTokenHeader = req.headers['x-refresh-token'] as string;
            const refreshToken = refreshTokenHeader && refreshTokenHeader.split(' ')[1];
    
            if(!refreshToken) {
                res.status(httpStatusCodes.UNAUTHORIZED);
            }
    
            const foundTokenRecord = await tokenService.findTokenRecordByRefreshToken(refreshToken);
            if(!foundTokenRecord) {
                logger.warn('Refresh token on request was not found in database');
                try {
                    const payload = await tokenService.verifyJwtTokenAsynchronously(refreshToken, JWT_REFRESH_SECRET);
                    if(payload && payload.userId) {
                        logger.warn(`Attempted refresh token reuse`);
                        await tokenService.deleteTokenRecordsByUserId(payload.userId);
                    }
                    return res.status(httpStatusCodes.FORBIDDEN).send('Token Reuse Detected')
                } catch (error) {
                    if(error instanceof TokenExpiredError || error instanceof JsonWebTokenError || error instanceof ForbiddenError) {
                        return res.sendStatus(httpStatusCodes.FORBIDDEN);
                    }
                    return next(error);
                }
            }
            
            await tokenService.deleteTokenRecordsByRefreshToken(refreshToken);
            try {
                const payload = await tokenService.verifyJwtTokenAsynchronously(refreshToken, JWT_REFRESH_SECRET);
                if(payload && payload.userId) {
                    const accessToken = tokenService.createAccessToken(payload);
                    const newRefreshToken = tokenService.createRefreshToken(payload);
                    await tokenService.createTokenRecordWithAccessAndRefreshTokens(accessToken, newRefreshToken, payload.userId);
    
                    return res
                        .set('X-Access-Token', `Bearer ${accessToken}`)
                        .set('X-Refresh-Token', `Bearer ${newRefreshToken}`)
                        .status(httpStatusCodes.ACCEPTED)
                        .send("Tokens refreshed successfully");
                } else {
                    logger.error('Decoded payload missing userId')
                    return res.sendStatus(httpStatusCodes.INTERNAL_SERVER_ERROR);
                }
            } catch (err) {
                return res.status(httpStatusCodes.FORBIDDEN).send('Invalid or expired refresh token');
            }
        } catch(error) {
            next(error);
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