import jwt from 'jsonwebtoken';
import { JWT_ACCESS_EXPIRATION, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRATION, NODE_ENV } from '../../config/config';
import tokenRepository from '../../repositories/tokenRepository';
import { TokenAttributes } from '../../models/Tokens';
import logger from '../../config/logger';
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

const getTokenExpiresIn = (tokenType: TokenType) => {
    if(tokenType == 'access') { 
        return JWT_ACCESS_EXPIRATION;
    } else {
        return JWT_REFRESH_EXPIRATION;
    }
}

/**
 * Service responsible for generating, verifying, and blacklisting JWT tokens.
 */
const tokenService = {

    createToken: (payload: UserJwtPayload, tokenType: TokenType): string => {
        return jwt.sign({userId : payload.userId}, getTokenSecret(tokenType), {expiresIn: getTokenExpiresIn(tokenType)});
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

    createAndAttachTokensToResponse: async (userId: UserAttributes['userId'], profileId: ProfileAttributes['profileId'], res: Response) => {
        const accessToken = tokenService.createToken({ userId, profileId }, 'access');
        const refreshToken = tokenService.createToken({ userId, profileId }, 'refresh');
    
        await tokenService.deleteTokenRecordsByUserId(userId);
        await tokenService.createTokenRecordWithAccessAndRefreshTokens(accessToken, refreshToken, userId);
    
        tokenService.attachTokensToResponse({accessToken, refreshToken}, res);
    },

    attachTokensToResponse: (tokens: {accessToken? : string, refreshToken? : string}, res: Response) => {
        if (tokens.accessToken) {
            logger.debug(`Setting access token as a cookie\n${tokens.accessToken}`);
            res.cookie('accessToken', tokens.accessToken, {
                httpOnly: true,
                secure: NODE_ENV === 'production',
                sameSite: 'strict'
            });
        }
        if (tokens.refreshToken) {
            logger.debug(`Setting refresh token as a cookie\n${tokens.refreshToken}`);
            res.cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                secure: NODE_ENV === 'production',
                sameSite: 'strict'
            });
        }
    }

};

export default tokenService;