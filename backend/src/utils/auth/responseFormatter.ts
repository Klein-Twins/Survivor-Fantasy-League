import { UserAttributes } from "../../models/User";
import { APIResponse, AuthLoginResponse, AuthResponse, AuthSignupResponse } from "../../types/auth";

const responseFormatter = {
    formatAuthSuccessResponse: (
        statusCode: number,
        message: string,
        user: UserAttributes,
        token: string
    ): AuthResponse => {
        return {
            apiResponse : responseFormatter.formatAPIResponse(statusCode, message),
            user: { username: user.USER_NAME, userProfileId: user.USER_PROFILE_ID },
            token,
        }
    },

    formatLoginResponse: (
        statusCode: number,
        message: string,
        user: UserAttributes,
        token: string
    ): AuthLoginResponse => {
        return responseFormatter.formatAuthSuccessResponse(statusCode, message, user, token);
    },

    // Format for signup response
    formatSignupResponse: (
        statusCode: number,
        message: string,
        user: UserAttributes,
        token: string
    ): AuthSignupResponse => {
        return responseFormatter.formatAuthSuccessResponse(statusCode, message, user, token);
    },

    formatAPIResponse: (statusCode: number, message: string): APIResponse => {
        return {message, statusCode}
    }
};

export default responseFormatter;