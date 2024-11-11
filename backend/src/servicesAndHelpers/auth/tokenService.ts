import jwt, { JsonWebTokenError, JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import errorFactory from "../../utils/errors/errorFactory";
import { JWT_EXPIRATION, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRATION } from '../../config/config';
import { UserAttributes } from '../../models/User';
import { BLACKLISTED_TOKEN_ERROR } from '../../constants/auth/responseErrorConstants';
import { ProfileAttributes } from '../../models/Profile';
import tokenRepository from '../../repositories/tokenRepository';
import { TokenAttributes } from '../../models/Tokens';
import logger from '../../config/logger';
import { ForbiddenError, InternalServerError } from '../../utils/errors/errors';

/**
 * Interface to represent the payload of a user JWT.
 * Extends the standard JwtPayload with custom user properties.
 */
export interface UserJwtPayload extends JwtPayload {
    userId: UserAttributes['userId'];
}

export type TokenType = 'access' | 'refresh';

/**
 * A set to store blacklisted tokens.
 * Blacklisted tokens cannot be used for further authentication.
 */
export const blacklistedTokens = new Set<string>();

const verifyJwtToken = (token: string, secret: string): Promise<UserJwtPayload> => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if(err) {
                if(err instanceof TokenExpiredError) {
                    return reject(err as TokenExpiredError);
                } else if (err instanceof JsonWebTokenError) {
                    return reject(err as JsonWebTokenError);
                } else {
                    return reject(new InternalServerError('Unexpected error verifying jwt token'))
                }
            }
            resolve(decoded as UserJwtPayload);
        })
    });
}

const getTokenSecret = (tokenType : TokenType) => {
    if(tokenType == 'access') {
        return JWT_ACCESS_SECRET;
    } else {
        return JWT_REFRESH_SECRET;
    }
}

/**
 * Service responsible for generating, verifying, and blacklisting JWT tokens.
 */
const tokenService = {
    createAccessToken: (payload: UserJwtPayload) : string => {
        logger.debug(JWT_EXPIRATION);
        logger.debug(payload);
        return jwt.sign({userId : payload.userId}, JWT_ACCESS_SECRET, {expiresIn: '30s'});
    },

    createRefreshToken: (payload: UserJwtPayload) : string => {
        logger.debug(JWT_REFRESH_EXPIRATION);
        logger.debug(payload);
        return jwt.sign({userId : payload.userId}, JWT_REFRESH_SECRET, {expiresIn: JWT_REFRESH_EXPIRATION});
    },

    findTokenRecordByRefreshToken: async (refreshToken: string) : Promise<TokenAttributes | null> => {
        return await tokenRepository.getTokenRecordByRefreshToken(refreshToken);
    },

    findTokenRecordByAccessToken: async (accessToken: string) : Promise<TokenAttributes | null> => {
        return await tokenRepository.getTokenRecordByAccessToken(accessToken);
    },

    createTokenRecordWithAccessAndRefreshTokens: async (accessToken: string, refreshToken: string, userId: string) => {
        try {
            return await tokenRepository.createTokenRecordWithAccessAndRefreshTokens(accessToken, refreshToken, userId);
        } catch (error) {
            logger.error(`Could not persist token record with (accessToken, refreshToken, userId) (${accessToken}, ${refreshToken}, ${userId}) to DB`)
        }
    },

    deleteTokenRecordsByUserId: async (userId: string) : Promise<number> => {
        return await tokenRepository.deleteTokenRecordsByUserId(userId);
    },

    deleteTokenRecordsByRefreshToken: async (refreshToken: string) : Promise<number> => {
        return await tokenRepository.deleteTokenRecordsByRefreshToken(refreshToken)
    },

    verifyJwtTokenAsynchronously: async (token: string, secret: string) : Promise<UserJwtPayload> => {
        return new Promise((resolve, reject) => {
            jwt.verify(token, secret, (err, decoded) => {
                if(err) {
                    if(err instanceof TokenExpiredError) {
                        logger.debug(`Token is expired`)
                        return reject(err as TokenExpiredError);
                    } else if(err instanceof JsonWebTokenError) {
                        logger.debug(`Invalid token`);
                        return reject(err as JsonWebTokenError);
                    }
                    return reject(new ForbiddenError("Forbidden"));
                }
                resolve(decoded as UserJwtPayload);
            })
        })
    },

    updateAccessTokenInTokenTableWithNewAccessToken : async (userId: string, accessToken : string) => {
        await tokenRepository.updateAccessTokenInTokenTableWithNewAccessToken(userId, accessToken)
    },

    validateTokenAndPromiseDecode: async (token: string, tokenType: TokenType): Promise<UserJwtPayload | null> => {
        try {
            const decoded = await jwt.verify(token, getTokenSecret(tokenType)) as UserJwtPayload;
            return decoded;
        } catch (err) {
            return null;
        }
    }
};

export default tokenService;