import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { JWT_EXPIRATION, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRATION } from '../../config/config';
import tokenRepository from '../../repositories/tokenRepository';
import { TokenAttributes } from '../../models/Tokens';
import logger from '../../config/logger';
import { ForbiddenError } from '../../utils/errors/errors';
import { Response } from 'express';
import { TokenType, UserJwtPayload } from '../../types/auth/tokenTypes';
import { ProfileAttributes } from '../../models/Profile';
import { UserAttributes } from '../../models/User';


export const blacklistedTokens = new Set<string>();


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

    updateAccessTokenInTokenTableWithNewAccessToken : async (userId: string, accessToken : string) => {
        await tokenRepository.updateAccessTokenInTokenTableWithNewAccessToken(userId, accessToken)
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

    validateTokenAndPromiseDecode: async (token: string, tokenType: TokenType): Promise<UserJwtPayload | null> => {
        try {
            const decoded = await jwt.verify(token, getTokenSecret(tokenType)) as UserJwtPayload;
            logger.debug(`${tokenType} token is valid`);
            return decoded;
        } catch (err) {
            logger.debug(`${tokenType} token is invalid: ${err}`);
            return null;
        }
    },

    refreshAccessTokenIfNeeded : async (refreshToken: string): Promise<{ accessToken: string, refreshToken: string } | null> => {
        const refreshTokenDecoded = await tokenService.validateTokenAndPromiseDecode(refreshToken, 'refresh');
        
        if (!refreshTokenDecoded) {
            logger.debug('Refresh token is invalid');
            return null;
        }
        const newAccessToken = tokenService.createAccessToken({ userId: refreshTokenDecoded.userId, profileId: refreshTokenDecoded.profileId });
        await tokenService.updateAccessTokenInTokenTableWithNewAccessToken(refreshTokenDecoded.userId, newAccessToken);
    
        return { accessToken: newAccessToken, refreshToken };
    },

    createAndAttachTokens: async (userId: UserAttributes['userId'], profileId: ProfileAttributes['profileId'], res: Response) => {
        const accessToken = tokenService.createAccessToken({ userId, profileId });
        const refreshToken = tokenService.createRefreshToken({ userId, profileId });
    
        await tokenService.deleteTokenRecordsByUserId(userId);
        await tokenService.createTokenRecordWithAccessAndRefreshTokens(accessToken, refreshToken, userId);
    
        tokenService.attachTokensToResponse({accessToken, refreshToken}, res);
    },

    attachTokensToResponse: (tokens: {accessToken? : string, refreshToken? : string}, res: Response) => {
        if (tokens.accessToken) {
            logger.debug(`Setting access token as a cookie`);
            logger.debug(tokens.accessToken);
            res.cookie('accessToken', tokens.accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict'
            });
        }
        if (tokens.refreshToken) {
            logger.debug(`Setting refresh token as a cookie`);
            logger.debug(tokens.refreshToken);
            res.cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict'
            });
        }

        //For response debugger...

    }

};

export default tokenService;