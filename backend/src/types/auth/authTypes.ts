import { APIResponseData } from '../api/apiResponseTypes';

/**
 * Response data for login and signup authentication API calls.
 * Extends from APIResponseData and includes user and token info.
 */
export interface AuthResponseData extends APIResponseData {
    user: {
        username: string;
        userProfileId: string;
    };
    token: string;
}

/**
 * Specific response type for the login API.
 * It extends the generic AuthResponseData type.
 */
export interface AuthLoginResponseData extends AuthResponseData {}

/**
 * Specific response type for the signup API.
 * It extends the generic AuthResponseData type.
 */
export interface AuthSignupResponseData extends AuthResponseData {}

/**
 * Specific response type for the logout API.
 * This is just a basic APIResponseData for the logout API.
 */
export interface AuthLogoutResponseData extends APIResponseData {}

/**
 * Request body for the login API.
 * Defines the input expected from the client when they log in.
 */
export interface LoginFields {
    email: string;
    password: string;
}

/**
 * Request body for the signup API.
 * Defines the input expected from the client when they sign up.
 */
export interface SignupFields {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
}