import { Request, Response, NextFunction } from "express";
import { LoginRequestFields } from "../../types/auth/authTypes";
import { isValidEmail } from "../../servicesAndHelpers/auth/authHelper";
import errorFactory from "../../utils/errors/errorFactory";
import authService from "../../servicesAndHelpers/auth/authService";
import { AccountAttributes } from "../../repositories/accountRepository";

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

            const account: AccountAttributes = await authService.login(formattedLoginRequestData);
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
    logout: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Placeholder for future logout logic if needed
            res.status(200).json({ message: "Logout successful" });
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
        throw errorFactory({ message: 'Missing email', statusCode: 400 });
    }
    if (!isValidEmail(loginRequestData.email)) {
        throw errorFactory({ message: 'Invalid Email', statusCode: 400 });
    }
    if (!loginRequestData.password || loginRequestData.password.length === 0) {
        throw errorFactory({ message: 'Missing password', statusCode: 400 });
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