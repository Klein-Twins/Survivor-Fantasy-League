import { Request, Response, NextFunction } from "express";
import { Account, SignupRequestFields } from "../../types/auth/authTypes";
import errorFactory from "../../utils/errors/errorFactory";
import { isValidEmail, isValidName, isValidUsername } from "../../servicesAndHelpers/auth/authHelper";
import passwordHelper from "../../servicesAndHelpers/password/passwordHelper";
import { AccountAttributes } from "../../repositories/accountRepository";
import accountService from "../../servicesAndHelpers/auth/accountService";
import { CREATE_ACCOUNT_FAILED_ERROR, INVALID_EMAIL_ERROR, INVALID_FIRST_NAME_ERROR, INVALID_LAST_NAME_ERROR, INVALID_USERNAME_ERROR, MISSING_EMAIL_ERROR, MISSING_PASSWORD_ERROR, MISSING_USERNAME_ERROR, WEAK_PASSWORD_ERROR } from "../../constants/auth/responseErrorConstants";
import logger from "../../config/logger";

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

            logger.debug("Signup Request received.");
            const signupRequestData: SignupRequestFields = {
                username: req.body.username,
                password: req.body.password,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
            };

            logger.debug(signupRequestData);

            validateCreateAccountRequest(signupRequestData);
            logger.debug("Successfully validated signup request data");

            const formattedSignupRequestData = formatCreateAccountRequest(signupRequestData);
            logger.debug("Formatted signup request data", formattedSignupRequestData);

            const accountData: Account = await accountService.createAccount(formattedSignupRequestData);
            if (!accountData) {
                logger.error("No Account data received - should have thrown an error before getting to this point.");
                throw errorFactory(CREATE_ACCOUNT_FAILED_ERROR);
            }

            logger.debug("Account Data");
            logger.debug(accountData);
            res.locals.account = accountData;
            next();
        } catch (error) {
            logger.error(`Caught error in account contoller ${error}`);
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
        logger.debug(`Missing email from request`);
        throw errorFactory(MISSING_EMAIL_ERROR);
    }
    if (!requestSignupData.password || requestSignupData.password.length === 0) {
        logger.debug(`Missing password from request`);
        throw errorFactory(MISSING_PASSWORD_ERROR);
    }
    if (!requestSignupData.username || requestSignupData.username.length === 0) {
        logger.debug(`Missing username from request`);
        throw errorFactory(MISSING_USERNAME_ERROR);
    }
    if (requestSignupData.firstName && !isValidName(requestSignupData.firstName)) {
        logger.debug(`First name from request is not valid`);
        throw errorFactory(INVALID_FIRST_NAME_ERROR);
    }
    if (requestSignupData.lastName && !isValidName(requestSignupData.lastName)) {
        logger.debug(`Last name from request is not valid`);
        throw errorFactory(INVALID_LAST_NAME_ERROR);
    }
    if (!isValidEmail(requestSignupData.email)) {
        logger.debug(`Email from request is not valid`);
        throw errorFactory(INVALID_EMAIL_ERROR);
    }
    if (!isValidUsername(requestSignupData.username)) {
        logger.debug(`Username from request is not valid`);
        throw errorFactory(INVALID_USERNAME_ERROR);
    }
    if (!passwordHelper.isPasswordStrong(requestSignupData.password)) {
        logger.debug(`Password from request is weak`);
        throw errorFactory(WEAK_PASSWORD_ERROR);
    }
};

/**
 * Formats the signup request data by converting the email to lowercase.
 * 
 * @param requestSignupData - The signup data from the request body
 * @returns A new object with the email in lowercase and other fields unchanged
 */
const formatCreateAccountRequest = (requestSignupData: SignupRequestFields): SignupRequestFields => {
    const formattedSignupRequestData = {
    ...requestSignupData,
    email: requestSignupData.email.toLowerCase(),
    }
    logger.debug("formatted signup request data:", JSON.stringify(formattedSignupRequestData));
    return formattedSignupRequestData;
};

export default accountController;