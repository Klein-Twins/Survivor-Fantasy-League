import { INVALID_EMAIL_ERROR, MISSING_EMAIL_ERROR, MISSING_PASSWORD_ERROR } from "../../constants/auth/responseErrorConstants";
import { isValidEmail } from "../../servicesAndHelpers/auth/authHelper";
import { LoginRequestFields } from "../../types/auth/authTypes";
import errorFactory from "../errors/errorFactory";

/**
 * Validates login request data, checking for a valid email and non-empty password.
 * Throws an error if validation fails.
 * 
 * @param loginRequestData - Object containing the email and password from the login request
 * @throws Will throw an error if email is invalid or if email/password are missing
 */
export const validateLoginRequest = (loginRequestData: LoginRequestFields): void => {
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
export const formatLoginRequest = (loginRequestData: LoginRequestFields): LoginRequestFields => ({
    ...loginRequestData,
    email: loginRequestData.email.toLowerCase(),
});
