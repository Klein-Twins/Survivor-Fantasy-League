import { Transaction } from 'sequelize';
import { Account } from '../../domain/account/Account';
import { TokenType } from '../../models/account/Tokens';
import { UserJwtPayload } from '../../types/auth/tokenTypes';
import { Token } from '../../domain/account/Token';
import sequelize from '../../config/db';
import { TokenRepository } from '../../repositories/account/TokenRepository';
import {
  ForbiddenError,
  InternalServerError,
  NotFoundError,
} from '../../utils/errors/errors';

export interface Tokens {
  accessToken: Token;
  refreshToken: Token;
}

export class TokenService {
  static async fetchTokens({
    accessToken,
    refreshToken,
  }: {
    accessToken: string;
    refreshToken: string;
  }): Promise<Tokens> {
    const foundAccessTokenData = await TokenRepository.fetchTokenData(
      accessToken
    );
    const foundRefreshTokenData = await TokenRepository.fetchTokenData(
      refreshToken
    );

    if (!foundAccessTokenData || !foundRefreshTokenData) {
      throw new NotFoundError('Tokens not found');
    }

    if (foundAccessTokenData.tokenType !== 'access') {
      throw new InternalServerError(
        'Access token provided is not stored in the database as an access token'
      );
    }
    if (foundRefreshTokenData.tokenType !== 'refresh') {
      throw new InternalServerError(
        'Refresh token provided is not stored in the database as a refresh token'
      );
    }
    if (foundAccessTokenData.userId !== foundRefreshTokenData.userId) {
      throw new ForbiddenError(
        'Refresh token and access token provided do not belong to the same user'
      );
    }

    return {
      accessToken: new Token({
        tokenType: 'access',
        token: foundAccessTokenData.token,
      }),
      refreshToken: new Token({
        tokenType: 'refresh',
        token: foundRefreshTokenData.token,
      }),
    };
  }

  static async fetchToken(
    tokenString: string,
    tokenType: TokenType
  ): Promise<Token> {
    const tokenData = await TokenRepository.fetchTokenData(tokenString);
    if (!tokenData) {
      throw new Error('Token not found');
    }

    const token = new Token({
      tokenType: tokenType,
      token: tokenData.token,
    });

    return token;
  }

  static async createTokens(account: Account): Promise<Tokens> {
    const accessToken = await TokenService.createToken(account, 'access');
    const refreshToken = await TokenService.createToken(account, 'refresh');
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  private static async createToken(
    account: Account,
    tokenType: TokenType,
    transaction?: Transaction
  ): Promise<Token> {
    const payload: UserJwtPayload = {
      userId: account.getAccountId(),
      profileId: account.getProfileId(),
      accountRole: account.getAccountRole(),
    };

    const token = new Token({
      tokenType: tokenType,
      payload: payload,
    });

    return token;
  }

  static async saveTokensForStartUserSession(account: Account, tokens: Tokens) {
    const transaction: Transaction = await sequelize.transaction();
    try {
      await TokenRepository.saveTokenForStartUserSession(
        tokens.accessToken,
        transaction
      );
      await TokenRepository.saveTokenForStartUserSession(
        tokens.refreshToken,
        transaction
      );
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async saveTokensForEndUserSession(
    account: Account,
    accessToken: Token,
    refreshToken: Token
  ) {
    const transaction: Transaction = await sequelize.transaction();
    try {
      await TokenRepository.saveTokenForEndUserSession(
        accessToken,
        transaction
      );
      await TokenRepository.saveTokenForEndUserSession(
        refreshToken,
        transaction
      );
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
