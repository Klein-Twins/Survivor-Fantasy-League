import { NODE_ENV } from "../config/config";
import logger from "../config/logger";
import { TokenType } from "../types/auth/tokenTypes";
import { Response } from "express";

const userSessionHelper = {
    attachTokenToResponse
}

function attachTokenToResponse(token: string, tokenType: TokenType, res: Response) {
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
}

export default userSessionHelper;