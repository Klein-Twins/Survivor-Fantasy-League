import { INVALID_TOKEN_ERROR } from '../../constants/auth/responseErrorConstants';
import errorFactory from "../../utils/errors/errorFactory";
import tokenService from './tokenService';

/**
 * Service responsible for handling user logout operations.
 * This includes verifying the validity of the session token
 * and blacklisting it to ensure the session is terminated.
 */
const logoutService = {
  
  /**
   * Logs the user out by invalidating and blacklisting the session token.
   * 
   * @param token - The session token to be invalidated.
   * @returns A response data object with a success message and status code.
   * @throws A 401 error if the token is invalid or has been blacklisted.
   */
  logout: (token: string) => {
    // Verify if the token is valid and not blacklisted
    if (!tokenService.verifyTokenIsNotBlacklistedAndIsValid(token)) {
      throw errorFactory(INVALID_TOKEN_ERROR);
    }

    // Blacklist the token to prevent further use
    tokenService.blacklistToken(token);

    // Return the response indicating successful logout
    return { message: 'Successfully logged out user', statusCode: 200 };
  },
};

export default logoutService;