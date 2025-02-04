import { models } from '../config/db';
import logger from '../config/logger';
import { TokenAttributes } from '../models/account/Tokens';
import userService from '../servicesAndHelpers/user/userService';
import { TokenType } from '../types/auth/tokenTypes';
import errorFactory from '../utils/errors/errorFactory';
import userRepository from './userRepository';

const tokenRepository = {
  getTokenRecordTiedToUserId: async (userId: string): Promise<TokenAttributes | null> => {
    return await models.Tokens.findOne({
      where: { userId },
    });
  },

  getTokenRecordByRefreshToken: async (refreshToken: string): Promise<TokenAttributes | null> => {
    return await models.Tokens.findOne({
      where: { refreshToken: refreshToken },
    });
  },

  getTokenRecordByAccessToken: async (accessToken: string): Promise<TokenAttributes | null> => {
    return await models.Tokens.findOne({
      where: { accessToken: accessToken },
    });
  },

  createTokenRecordWithAccessAndRefreshTokens: async (
    accessToken: string,
    refreshToken: string,
    userId: string
  ): Promise<TokenAttributes> => {
    return await models.Tokens.create({
      accessToken,
      refreshToken,
      userId,
    });
  },

  deleteTokenRecordsByProfileId: async (profileId: string): Promise<number> => {
    const userIdTiedToProfileId = await userService.getUserIdByProfileId(profileId);

    if (!userIdTiedToProfileId) {
      logger.error('profile Id is not tied to user Id');
      return 0;
    }

    return await tokenRepository.deleteTokenRecordsByUserId(userIdTiedToProfileId);
  },

  deleteTokenRecordsByUserId: async (userId: string): Promise<number> => {
    const numDeleted = await models.Tokens.destroy({
      where: { userId: userId },
    });
    return numDeleted;
  },

  deleteTokenRecordsByToken: async (token: string, tokenType: TokenType): Promise<number> => {
    const tokenField = tokenType === 'access' ? 'accessToken' : 'refreshToken';
    const numDeleted = await models.Tokens.destroy({
      where: { [tokenField]: token },
    });
    return numDeleted;
  },

  verifyTokenWithUserIdInDatabase: async (token: string, userId: string, tokenType: TokenType): Promise<boolean> => {
    const activeTokensForUser = await models.Tokens.findOne({ where: { userId } });
    if (!activeTokensForUser) {
      return false;
    }

    if (tokenType === 'access') {
      if (token !== activeTokensForUser.accessToken) {
        return false;
      }
    } else {
      if (token !== activeTokensForUser.refreshToken) {
        return false;
      }
    }

    return true;
  },

  upsertTokenIntoDatabase: async (token: string, userId: string, tokenType: TokenType): Promise<void> => {
    try {
      const tokenField: 'accessToken' | 'refreshToken' = tokenType === 'access' ? 'accessToken' : 'refreshToken';

      const tokenData: Partial<TokenAttributes> & Pick<TokenAttributes, 'userId'> = {
        userId,
        [tokenField]: token,
      };

      const [result, created] = await models.Tokens.upsert(tokenData);

      logger.debug(
        created
          ? `New ${tokenType} token created for user ${userId}.`
          : `${tokenType} token updated for user ${userId}.`
      );
    } catch (error) {
      console.error('Error during upsertTokenIntoDatabase:', error);
    }
  },
};

export default tokenRepository;
