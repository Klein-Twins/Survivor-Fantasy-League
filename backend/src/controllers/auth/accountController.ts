import { Request, Response, NextFunction } from "express";
import { SignupRequestFields } from "../../types/auth/authTypes";
import errorFactory from "../../utils/errors/errorFactory";
import { isValidEmail, isValidName, isValidUsername } from "../../servicesAndHelpers/auth/authHelper";
import passwordHelper from "../../servicesAndHelpers/password/passwordHelper";
import { AccountAttributes } from "../../repositories/accountRepository";
import accountService from "../../servicesAndHelpers/auth/accountService";

/**
 * Controller for managing account-related actions, including creating accounts.
 */
const accountController = {
    /**
     * Handles the creation of a new account by validating and formatting input,
     * then invoking the account service to create the account.
     * 
     * @param req - Express request object containing signup data in the body
     * @param res - Express response object to attach account data to `res.locals`
     * @param next - Express NextFunction to pass control to the next middleware or error handler
     */
    createAccount: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const signupRequestData: SignupRequestFields = {
                username: req.body.username,
                password: req.body.password,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
            };

            validateCreateAccountRequest(signupRequestData);
            const formattedSignupRequestData = formatCreateAccountRequest(signupRequestData);

            const accountData: AccountAttributes = await accountService.createAccount(formattedSignupRequestData);
            if (!accountData) {
                throw errorFactory({
                    message: "Failed to create account",
                    statusCode: 500,
                });
            }

            res.locals.account = accountData;
            next();
        } catch (error) {
            next(error);
        }
    },
};

/**
 * Validates signup request data to ensure all required fields are present and correctly formatted.
 * 
 * @param requestSignupData - The signup data from the request body
 * @throws Will throw an error if any field is invalid or missing
 */
const validateCreateAccountRequest = (requestSignupData: SignupRequestFields): void => {
    if (!requestSignupData.email || requestSignupData.email.length === 0) {
        throw errorFactory({ message: 'Missing email', statusCode: 400 });
    }
    if (!requestSignupData.password || requestSignupData.password.length === 0) {
        throw errorFactory({ message: 'Missing password', statusCode: 400 });
    }
    if (!requestSignupData.username || requestSignupData.username.length === 0) {
        throw errorFactory({ message: 'Missing username', statusCode: 400 });
    }
    if (requestSignupData.firstName && !isValidName(requestSignupData.firstName)) {
        throw errorFactory({ message: 'Invalid first name: only letters and spaces allowed', statusCode: 400 });
    }
    if (requestSignupData.lastName && !isValidName(requestSignupData.lastName)) {
        throw errorFactory({ message: 'Invalid last name: only letters and spaces allowed', statusCode: 400 });
    }
    if (!isValidEmail(requestSignupData.email)) {
        throw errorFactory({ message: 'Invalid email', statusCode: 400 });
    }
    if (!isValidUsername(requestSignupData.username)) {
        throw errorFactory({ message: 'Invalid username: only letters and numbers allowed', statusCode: 400 });
    }
    if (!passwordHelper.isPasswordStrong(requestSignupData.password)) {
        throw errorFactory({ message: 'Password is too weak', statusCode: 400 });
    }
};

/**
 * Formats the signup request data by converting the email to lowercase.
 * 
 * @param requestSignupData - The signup data from the request body
 * @returns A new object with the email in lowercase and other fields unchanged
 */
const formatCreateAccountRequest = (requestSignupData: SignupRequestFields): SignupRequestFields => ({
    ...requestSignupData,
    email: requestSignupData.email.toLowerCase(),
});

export default accountController;