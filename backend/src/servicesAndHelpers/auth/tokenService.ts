import jwt, { JwtPayload } from 'jsonwebtoken';
import errorFactory from "../../utils/errors/errorFactory";

// Load secret and expiration time from environment variables
import { JWT_SECRET, JWT_EXPIRATION } from '../../config/config';

// Set to store blacklisted tokens
const blacklistedTokens = new Set<string>();

/**
 * Service proiding functions for generating, verifying, and blacklisting JWT tokens.
 *
 * The `tokenService` is responsible for creating JWT tokens for authenticated users, verifying the validity of those tokens,
 * and blacklisting tokens that should no longer be used (e.g., for logout or security purposes).
 *
 * ### Available Functions:
 * - `generateToken`: Creates a new JWT token with a payload and a secret key.
 * - `verifyToken`: Validates a given JWT token to ensure it's authentic and not blacklisted.
 * - `blacklistToken`: Adds a token to a blacklist, preventing its further use for authentication.
 *
 * The token functions use the `jsonwebtoken` library to perform JWT operations, ensuring secure and efficient management
 * of authentication tokens.
 */
const tokenService = {
    /**
     * Generates a JWT token for the provided payload.
     * 
     * This function signs the payload with a secret key and includes an expiration time 
     * as defined in the environment variables. The resulting token can be used for authenticating requests.
     * 
     * ### Parameters:
     * - `payload` (JwtPayload): The data to be encoded in the JWT token (typically user data like `userId`).
     * 
     * ### Returns:
     * - A signed JWT token as a string.
     * 
     * ### Example:
     * ```typescript
     * const token = tokenService.generateToken({ user: 12345 });
     * ```
     *
     * @param {JwtPayload} payload - The data to encode in the token.
     * @returns {string} - The generated JWT token.
     */
    generateToken: (payload: JwtPayload): string => {
        // Signs and returns the JWT token
        return jwt.sign(payload, JWT_SECRET as jwt.Secret, { expiresIn: JWT_EXPIRATION });
    },

    /**
     * Verifies the authenticity of a given JWT token.
     * 
     * This function checks whether the token has been blacklisted. If the token is not blacklisted, 
     * it verifies the token using the secret key and returns the decoded payload. If the token is invalid or expired, 
     * it throws an error.
     * 
     * ### Parameters:
     * - `token` (string): The JWT token to be verified.
     * 
     * ### Returns:
     * - The decoded payload of the JWT token (JwtPayload), containing the original data encoded in the token.
     * 
     * ### Throws:
     * - Throws an error with status `401 Unauthorized` if the token is blacklisted or invalid.
     * 
     * ### Example:
     * ```typescript
     * const decoded = tokenService.verifyToken(token);
     * ```
     *
     * @param {string} token - The JWT token to verify.
     * @returns {JwtPayload} - The decoded payload of the valid token.
     * @throws {Error} - Throws an error if the token is blacklisted or invalid.
     */
    verifyToken: (token: string): JwtPayload => {
        // Check if the token is blacklisted
        if (blacklistedTokens.has(token)) {
            throw errorFactory({ message: 'Token Blacklisted', statusCode: 401 });
        }
        
        // Verify and decode the token, return the payload
        return jwt.verify(token, JWT_SECRET as jwt.Secret) as JwtPayload;
    },

    /**
     * Adds a token to the blacklist, preventing it from being used for authentication.
     * 
     * This function is useful for logging out users by invalidating their tokens or for blocking tokens 
     * in case of a security breach. Once a token is blacklisted, any further attempts to verify it 
     * will result in an error.
     * 
     * ### Parameters:
     * - `token` (string): The JWT token to be blacklisted.
     * 
     * ### Example:
     * ```typescript
     * tokenService.blacklistToken(token);
     * ```
     *
     * @param {string} token - The token to add to the blacklist.
     * @returns {void} - This function does not return any value.
     */
    blacklistToken: (token: string): void => {
        // Add the token to the blacklist set
        blacklistedTokens.add(token);
    }
};

export default tokenService;