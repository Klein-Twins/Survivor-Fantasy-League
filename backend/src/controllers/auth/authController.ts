import { Request, Response, NextFunction } from "express";
import { Account, LoginRequestFields } from "../../types/auth/authTypes";
import { isValidEmail } from "../../servicesAndHelpers/auth/authHelper";
import errorFactory from "../../utils/errors/errorFactory";
import authService from "../../servicesAndHelpers/auth/authService";
import { INTERNAL_SERVER_ERROR, INVALID_EMAIL_ERROR, MISSING_EMAIL_ERROR, MISSING_PASSWORD_ERROR } from "../../constants/auth/responseErrorConstants";
import { AuthenticatedRequest } from "../../middleware/tokenMiddleware";
import logger from "../../config/logger";
import tokenService from "../../servicesAndHelpers/auth/tokenService";

/**
 * Controller for handling authentication actions.
 */
const authController = {
    /**
     * Handles user login requests by validating input, formatting the data, and invoking the authService login function.
     * If successful, attaches the account information to `res.locals` and calls the next middleware.
     * 
     * @param req - Express Request object containing email and password in the body
     * @param res - Express Response object to attach the account to `res.locals`
     * @param next - Express NextFunction to pass control to the next middleware or error handler
     */
    login: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const loginRequestData: LoginRequestFields = {
                email: req.body.email,
                password: req.body.password,
            };

            validateLoginRequest(loginRequestData);
            const formattedLoginRequestData = formatLoginRequest(loginRequestData);

            const account: Account = await authService.login(formattedLoginRequestData);
            res.locals.account = account;

            next();
        } catch (error) {
            next(error);
        }
    },

    /**
     * Handles user logout requests.
     *
     * @param req - Express Request object
     * @param res - Express Response object
     * @param next - Express NextFunction to pass control to the next middleware or error handler
     */
    logout: async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {

            //To do, pass in the account/ userid to invalidate all active tokens if the token passed to this fails to authenticate.

            logger.debug(req.decodedToken);
            if(!req.decodedToken) {
                throw(errorFactory({statusCode: INTERNAL_SERVER_ERROR.statusCode, message: 'Failed to get decoded token values'}));
            }
            //We know this token exists as no error was thrown in the tokenMiddleware.authenticateToken
            tokenService.blacklistToken(req.headers['authorization']?.split(' ')[1] as string);

            res.status(200).json({message: "Logout successful"});
        } catch (error) {
            next(error);
        }
    },
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