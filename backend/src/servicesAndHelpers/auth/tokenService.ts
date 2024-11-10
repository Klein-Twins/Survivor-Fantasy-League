import jwt, { JwtPayload } from 'jsonwebtoken';
import errorFactory from "../../utils/errors/errorFactory";
import { JWT_SECRET, JWT_EXPIRATION } from '../../config/config';
import { UserAttributes } from '../../models/User';
import { BLACKLISTED_TOKEN_ERROR } from '../../constants/auth/responseErrorConstants';

/**
 * Interface to represent the payload of a user JWT.
 * Extends the standard JwtPayload with custom user properties.
 */
export interface UserJwtPayload extends JwtPayload {
    userId: UserAttributes["USER_ID"];
}

/**
 * A set to store blacklisted tokens.
 * Blacklisted tokens cannot be used for further authentication.
 */
export const blacklistedTokens = new Set<string>();

/**
 * Service responsible for generating, verifying, and blacklisting JWT tokens.
 */
const tokenService = {

    /**
     * Generates a JWT token using the provided payload.
     * 
     * @param payload - The payload to be included in the JWT token.
     * @returns A signed JWT token as a string.
     */
    generateToken: (payload: UserJwtPayload): string => {
        return jwt.sign(payload, JWT_SECRET as jwt.Secret, { expiresIn: JWT_EXPIRATION });
    },

    /**
     * Verifies if a given token is valid and not blacklisted.
     * 
     * @param token - The JWT token to verify.
     * @returns The decoded token payload if valid.
     * @throws A 401 error if the token is blacklisted or invalid.
     */
    isTokenBlacklisted: (token: string): boolean => {
        return blacklistedTokens.has(token)
    },

    /**
     * Blacklists a given token to prevent it from being used again.
     * 
     * @param token - The JWT token to blacklist.
     */
    blacklistToken: (token: string): void => {
        blacklistedTokens.add(token);
    },
};

export default tokenService;