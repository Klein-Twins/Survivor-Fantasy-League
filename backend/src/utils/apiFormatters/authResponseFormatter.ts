import { UserAttributes } from "../../models/User";
import { AuthLoginResponseData, AuthResponseData, AuthSignupResponseData } from "../../types/auth/authTypes";
import formatAPIResponse from "./apiResponseFormatter";

/**
 * Formats a common response for both login and signup actions.
 *
 * This utility function is used to create a response that includes the standard API response data 
 * along with user-specific details and a JWT token.
 *
 * ### Parameters:
 * - `statusCode` (number): The HTTP status code for the response.
 * - `message` (string): The message to be included in the response.
 * - `user` (UserAttributes): The user data to include in the response.
 * - `token` (string): The JWT token to be included in the response.
 *
 * ### Returns:
 * - An object of type `AuthResponseData`, including the `statusCode`, `message`, `user`, and `token`.
 *
 * @param {number} statusCode - The HTTP status code for the response.
 * @param {string} message - The message to be included in the response.
 * @param {UserAttributes} user - The user details to be included in the response.
 * @param {string} token - The JWT token to be included in the response.
 * @returns {AuthResponseData} - The formatted response with the status code, message, user data, and token.
 */
const formatAuthLoginSignupResponse = (
    statusCode: number,
    message: string,
    user: UserAttributes,
    token: string
): AuthResponseData => {
    return {
        ...formatAPIResponse(statusCode, message),
        user: { username: user.USER_NAME, userProfileId: user.USER_PROFILE_ID },
        token,
    }
};
const authResponseFormatter = {
    /**
     * Formats a login response with user details and token.
     *
     * This function uses the `formatAuthLoginSignupResponse` helper to create a login-specific response.
     *
     * ### Parameters:
     * - `statusCode` (number): The HTTP status code for the response.
     * - `message` (string): The message to be included in the response.
     * - `user` (UserAttributes): The user data to include in the response.
     * - `token` (string): The JWT token to be included in the response.
     *
     * ### Returns:
     * - An object of type `AuthLoginResponseData`, which includes the `statusCode`, `message`, `user`, and `token`.
     *
     * @param {number} statusCode - The HTTP status code for the response.
     * @param {string} message - The message to be included in the response.
     * @param {UserAttributes} user - The user details to be included in the response.
     * @param {string} token - The JWT token to be included in the response.
     * @returns {AuthLoginResponseData} - The formatted login response.
     */
    formatLoginResponse: (
        statusCode: number,
        message: string,
        user: UserAttributes,
        token: string
    ): AuthLoginResponseData => {
        return formatAuthLoginSignupResponse(statusCode, message, user, token);
    },

    /**
     * Formats a signup response with user details and token.
     *
     * This function uses the `formatAuthLoginSignupResponse` helper to create a signup-specific response.
     *
     * ### Parameters:
     * - `statusCode` (number): The HTTP status code for the response.
     * - `message` (string): The message to be included in the response.
     * - `user` (UserAttributes): The user data to include in the response.
     * - `token` (string): The JWT token to be included in the response.
     *
     * ### Returns:
     * - An object of type `AuthSignupResponseData`, which includes the `statusCode`, `message`, `user`, and `token`.
     *
     * @param {number} statusCode - The HTTP status code for the response.
     * @param {string} message - The message to be included in the response.
     * @param {UserAttributes} user - The user details to be included in the response.
     * @param {string} token - The JWT token to be included in the response.
     * @returns {AuthSignupResponseData} - The formatted signup response.
     */
    formatSignupResponse: (
        statusCode: number,
        message: string,
        user: UserAttributes,
        token: string
    ): AuthSignupResponseData => {
        return formatAuthLoginSignupResponse(statusCode, message, user, token);
    },
};

export default authResponseFormatter;