import { Response } from "express";
import logger from "../config/logger";
import { Account, UserSession } from "../generated-api";
import tokenRepository from "../repositories/tokenRepository";
import { TokenType, UserJwtPayload } from "../types/auth/tokenTypes";
import tokenService from "./auth/tokenService";
import { NODE_ENV } from "../config/config";
import jwt from 'jsonwebtoken';
import userSessionHelper from "./userSessionHelper";



async function createUserSessionAndAttachTokensToResponse(account: Account, response: Response): Promise<UserSession> {

    const { accessToken, refreshToken } = await createTokens(account);

    const numSecondsTokenIsValid: number = tokenService.getNumSecondsTokenIsValid(refreshToken);
    const isAuthenticated: boolean = true;

    userSessionHelper.attachTokenToResponse(accessToken, 'access', response);
    userSessionHelper.attachTokenToResponse(refreshToken, 'refresh', response);

    return {
        numSecondsRefreshTokenExpiresIn: numSecondsTokenIsValid,
        isAuthenticated: isAuthenticated
    }
}

async function createTokens(account: Account): Promise<{ refreshToken: string, accessToken: string }> {

    const accessToken: string = await tokenService.createToken(account, 'access');
    const refreshToken: string = await tokenService.createToken(account, 'refresh');

    await tokenRepository.upsertTokenIntoDatabase(accessToken, account.userId, 'access');
    await tokenRepository.upsertTokenIntoDatabase(refreshToken, account.userId, 'refresh');

    return { refreshToken, accessToken };
}

async function deleteSession({ accessToken, refreshToken }: { accessToken?: string, refreshToken?: string }): Promise<void> {
    let accessTokenDecoded: UserJwtPayload | null = null;
    let refreshTokenDecoded: UserJwtPayload | null = null;

    if (accessToken) {
        accessTokenDecoded = jwt.decode(accessToken) as UserJwtPayload | null;
    }
    if (refreshToken) {
        refreshTokenDecoded = jwt.decode(refreshToken) as UserJwtPayload | null;
    }

    const numSessionsDeleted = await tokenService.clearAllTokenData({
        accessTokenDecoded,
        refreshTokenDecoded,
        accessToken,
        refreshToken,
    })

    if (numSessionsDeleted !== 1) {
        logger.error(`${numSessionsDeleted} Sessions Deleted.`)
    }
}

// async function extendSession(): Promise<{ accessToken: string, refreshToken: string }> {

// }

const userSessionService = {
    createUserSessionAndAttachTokensToResponse,
    deleteSession
}

export default userSessionService;