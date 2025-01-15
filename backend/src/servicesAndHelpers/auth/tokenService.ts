import jwt from 'jsonwebtoken';
import { JWT_ACCESS_EXPIRATION, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRATION, NODE_ENV } from '../../config/config';
import tokenRepository from '../../repositories/tokenRepository';
import { TokenAttributes } from '../../models/Tokens';
import logger from '../../config/logger';
import { Response } from 'express';
import { TokenType, UserJwtPayload } from '../../types/auth/tokenTypes';
import { ProfileAttributes } from '../../models/Profile';
import { UserAttributes } from '../../models/User';
import userService from '../user/userService';
import accountService from './accountService';
import errorFactory from '../../utils/errors/errorFactory';
import { INTERNAL_SERVER_ERROR, UNAUTHORIZED_ERROR } from '../../constants/auth/responseErrorConstants';


export const blacklistedTokens = new Set<string>();


const getTokenSecret = (tokenType: TokenType) => {
    if (tokenType == 'access') {
        return JWT_ACCESS_SECRET;
    } else {
        return JWT_REFRESH_SECRET;
    }
}

const getTokenExpiresIn = (tokenType: TokenType) => {
    if (tokenType == 'access') {
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
        return jwt.sign({ userId: payload.userId, profileId: payload.profileId }, getTokenSecret(tokenType), { expiresIn: getTokenExpiresIn(tokenType) });
    },

    isTokenExpired: async (token: string, tokenType: TokenType): Promise<boolean> => {
        try {
            await jwt.verify(token, getTokenSecret(tokenType));
            return false;
        } catch (err) {
            return true;
        }
    },

    verifyTokensInDatabase: async (accessToken: string, refreshToken: string, userId: string): Promise<boolean> => {
        const accessTokenInDB = await tokenRepository.verifyTokenWithUserIdInDatabase(accessToken, userId, 'access');
        const refreshTokenInDB = await tokenRepository.verifyTokenWithUserIdInDatabase(refreshToken, userId, 'refresh');

        return accessTokenInDB && refreshTokenInDB;
    },

    createAndAttachTokenToResponse: async (userId: UserAttributes['userId'], profileId: ProfileAttributes['profileId'], tokenType: TokenType, res: Response) => {
        const token = tokenService.createToken({ userId, profileId }, tokenType);
        await tokenRepository.upsertTokenIntoDatabase(token, userId, tokenType);
        tokenService.attachTokenToResponse(token, tokenType, res);
        return token;
    },

    createAndAttachTokensToResponse: async (userId: UserAttributes['userId'], profileId: ProfileAttributes['profileId'], res: Response): Promise<{ accessToken: string, refreshToken: string }> => {
        const accessToken = await tokenService.createAndAttachTokenToResponse(userId, profileId, 'access', res);
        const refreshToken = await tokenService.createAndAttachTokenToResponse(userId, profileId, 'refresh', res);
        return { accessToken, refreshToken };
    },

    numSecondsTokenIsValid: (token: string): number => {
        const decodedToken = jwt.decode(token) as UserJwtPayload | null;
        if (!decodedToken || !decodedToken.exp) {
            logger.error("Cannot decode token for calculating number of seconds the token is valid for.");
            throw errorFactory(INTERNAL_SERVER_ERROR);
        }
        return decodedToken.exp - Math.floor(Date.now() / 1000);
    },

    attachTokenToResponse: (token: string, tokenType: TokenType, res: Response) => {
        if (tokenType === 'access') {
            logger.debug(`Setting access token as a cookie\n${token}`);
            res.cookie('accessToken', token, {
                httpOnly: true,
                secure: NODE_ENV === 'production',
                sameSite: 'strict'
            });
        }
        if (tokenType === 'refresh') {
            logger.debug(`Setting refresh token as a cookie\n${token}`);
            res.cookie('refreshToken', token, {
                httpOnly: true,
                secure: NODE_ENV === 'production',
                sameSite: 'strict'
            });
        }
    },

    clearAllTokenData: async (
        tokenData: {
            accessTokenDecoded: UserJwtPayload | null,
            refreshTokenDecoded: UserJwtPayload | null,
            profileIdReqParam?: string,
            refreshToken?: string,
            accessToken?: string
        }): Promise<number> => {

        let numSessionsDeleted = 0;
        try {
            if (tokenData.accessTokenDecoded != null) {
                const profileId = tokenData.accessTokenDecoded.profileId;
                const userId = tokenData.accessTokenDecoded.userId

                numSessionsDeleted += await tokenRepository.deleteTokenRecordsByUserId(userId);
                numSessionsDeleted += await tokenRepository.deleteTokenRecordsByProfileId(profileId);
            }
            if (tokenData.refreshTokenDecoded != null) {
                const profileId = tokenData.refreshTokenDecoded.profileId;
                const userId = tokenData.refreshTokenDecoded.userId;

                numSessionsDeleted += await tokenRepository.deleteTokenRecordsByUserId(userId);
                numSessionsDeleted += await tokenRepository.deleteTokenRecordsByProfileId(profileId);
            }
            if (tokenData.profileIdReqParam != null) {
                const profileId = tokenData.profileIdReqParam;

                numSessionsDeleted += await tokenRepository.deleteTokenRecordsByProfileId(profileId);
            }
            if (tokenData.refreshToken != null) {
                const refreshToken = tokenData.refreshToken;

                numSessionsDeleted += await tokenRepository.deleteTokenRecordsByToken(refreshToken, 'refresh');
            }
            if (tokenData.accessToken != null) {
                const accessToken = tokenData.accessToken;

                numSessionsDeleted += await tokenRepository.deleteTokenRecordsByToken(accessToken, 'refresh');
            }
        } catch (error) {
            logger.error("Caught error during extensiveLogout forced repository calls.");
        }
        return numSessionsDeleted;
    }
};

export default tokenService;