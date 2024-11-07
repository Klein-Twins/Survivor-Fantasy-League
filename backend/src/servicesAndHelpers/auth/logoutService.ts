import authService from './tokenService';
import errorFactory from "../../utils/errors/errorFactory";
import { AuthLogoutResponseData } from '../../types/auth/authTypes';

const logoutService = {
    /**
     * Logs a user out by verifying the session token, invalidating it by blacklisting,
     * and returning a success response.
     * 
     * Steps:
     * 1. Verifies if the provided session token is valid.
     * 2. Blacklists the token to invalidate it and prevent further use.
     * 3. Returns a response indicating that the logout process was successful.
     * 
     * @param {string} token - The JWT token provided by the user, which is required for authentication.
     * @returns {AuthLogoutResponseData} - The response data containing a success message and HTTP status code.
     * 
     * @throws {Error} - Throws an error if the token is invalid:
     * - If the session token is invalid, it will throw an error with a `401` status code and a message `'Session token invalid'`.
     * 
     * @example
     * const response = await logoutService.logout(userToken);
     * console.log(response); // { message: 'Successfully logged out user', statusCode: 200 }
     */
    logout: (token: string): AuthLogoutResponseData => {
        // Verify the token's validity
        if (!authService.verifyToken(token)) {
            throw errorFactory({ message: "Session token invalid", statusCode: 401 });
        }

        // Blacklist the token to invalidate it
        authService.blacklistToken(token);

        // Return the successful logout response
        return { message: 'Successfully logged out user', statusCode: 200 };
    }
};

export default logoutService;