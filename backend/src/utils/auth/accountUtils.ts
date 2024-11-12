import { SignupRequestFields } from "../../types/auth/authTypes";
import errorFactory from "../../utils/errors/errorFactory";
import { isValidEmail, isValidName, isValidUsername } from "../../servicesAndHelpers/auth/authHelper";
import passwordHelper from "../../servicesAndHelpers/password/passwordHelper";
import { INVALID_EMAIL_ERROR, INVALID_FIRST_NAME_ERROR, INVALID_LAST_NAME_ERROR, INVALID_USERNAME_ERROR, MISSING_EMAIL_ERROR, MISSING_PASSWORD_ERROR, MISSING_USERNAME_ERROR, WEAK_PASSWORD_ERROR } from "../../constants/auth/responseErrorConstants";
import logger from "../../config/logger";

export const validateSignupData = (signupData: SignupRequestFields): void => {
    const checks = [
        { condition: !signupData.email, error: MISSING_EMAIL_ERROR },
        { condition: !signupData.password, error: MISSING_PASSWORD_ERROR },
        { condition: !signupData.username, error: MISSING_USERNAME_ERROR },
        { condition: signupData.firstName && !isValidName(signupData.firstName), error: INVALID_FIRST_NAME_ERROR },
        { condition: signupData.lastName && !isValidName(signupData.lastName), error: INVALID_LAST_NAME_ERROR },
        { condition: !isValidEmail(signupData.email), error: INVALID_EMAIL_ERROR },
        { condition: !isValidUsername(signupData.username), error: INVALID_USERNAME_ERROR },
        { condition: !passwordHelper.isPasswordStrong(signupData.password), error: WEAK_PASSWORD_ERROR },
    ];

    for (const { condition, error } of checks) {
        if (condition) {
            logger.debug(`Validation failed: ${error}`);
            throw errorFactory(error);
        }
    }
};

export const formatSignupData = (signupData: SignupRequestFields): SignupRequestFields => {
    const formattedData = {
        ...signupData,
        email: signupData.email.toLowerCase(),
    };
    logger.debug("Formatted Signup Request Data:", JSON.stringify(formattedData));
    return formattedData;
};