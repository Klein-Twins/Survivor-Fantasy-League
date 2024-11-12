import { models } from "../config/db";
import logger from "../config/logger";
import { TokenAttributes } from "../models/Tokens";


const tokenRepository = {
    getTokenRecordTiedToUserId: async(userId: string) : Promise<TokenAttributes | null> => {
        return await models.Tokens.findOne({
            where: { userId }
        });
    },

    getTokenRecordByRefreshToken: async(refreshToken: string) : Promise<TokenAttributes | null> => {
        return await models.Tokens.findOne({
            where: { refreshToken : refreshToken}
        });
    },

    getTokenRecordByAccessToken: async(accessToken: string) : Promise<TokenAttributes | null> => {
        return await models.Tokens.findOne({
            where: { accessToken : accessToken}
        });
    },

    createTokenRecordWithAccessAndRefreshTokens: async (accessToken: string, refreshToken: string, userId: string) : Promise<TokenAttributes> => {
        return await models.Tokens.create({
            accessToken,
            refreshToken,
            userId
        })
    },

    deleteTokenRecordsByUserId: async (userId: string) : Promise<number> => {
        const numDeleted = await models.Tokens.destroy({
            where: {userId : userId}
        });
        if(numDeleted != 1) {
            logger.warn(`Deleted ${numDeleted} Token records tied to userId: ${userId}`);
        } else {
            logger.debug(`Deleted token record tied to userId: ${userId}`);
        }
        return numDeleted
    },

    deleteTokenRecordsByRefreshToken: async (refreshToken: string) : Promise<number> => {
        const numDeleted = await models.Tokens.destroy({
            where: {refreshToken : refreshToken}
        });
        if(numDeleted != 1) {
            logger.warn(`Deleted ${numDeleted} Token records tied to refresh token: ${refreshToken}`);
        } else {
            logger.debug(`Deleted token record tied to refresh token: ${refreshToken}`);
        }
        return numDeleted;
    },

    updateAccessTokenInTokenTableWithNewAccessToken: async (userId: string, accessToken: string) => {
        await models.Tokens.update({
            accessToken : accessToken
        }, {
            where: {
                userId : userId
            }
        })
    }
}

export default tokenRepository;