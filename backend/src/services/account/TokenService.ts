import { Transaction } from 'sequelize';
import { Account } from '../../domain/account/Account';
import { TokenType } from '../../models/account/Tokens';
import { UserJwtPayload } from '../../types/auth/tokenTypes';
import sequelize from '../../config/db';
import { TokenRepository } from '../../repositories/account/TokenRepository';
import {
  ForbiddenError,
  InternalServerError,
  NotFoundError,
} from '../../utils/errors/errors';
import { inject, injectable } from 'tsyringe';
import { Token } from '../../domain/account/Token';
import { UserSessionAttributes } from '../../models/userSession/userSessions';
import { UserSession } from '../../domain/account/UserSession';

export interface Tokens {
  accessToken: Token;
  refreshToken: Token;
}

@injectable()
export class TokenService {
  constructor(
    @inject(TokenRepository) private tokenRepository: TokenRepository
  ) {}

  // static async fetchTokens({
  //   accessToken,
  //   refreshToken,
  // }: {
  //   accessToken: string;
  //   refreshToken: string;
  // }): Promise<Tokens> {
  //   const foundAccessTokenData = await TokenRepository.fetchTokenData(
  //     accessToken
  //   );
  //   const foundRefreshTokenData = await TokenRepository.fetchTokenData(
  //     refreshToken
  //   );

  //   if (!foundAccessTokenData || !foundRefreshTokenData) {
  //     throw new NotFoundError('Tokens not found');
  //   }

  //   if (foundAccessTokenData.tokenType !== 'access') {
  //     throw new InternalServerError(
  //       'Access token provided is not stored in the database as an access token'
  //     );
  //   }
  //   if (foundRefreshTokenData.tokenType !== 'refresh') {
  //     throw new InternalServerError(
  //       'Refresh token provided is not stored in the database as a refresh token'
  //     );
  //   }
  //   if (foundAccessTokenData.userId !== foundRefreshTokenData.userId) {
  //     throw new ForbiddenError(
  //       'Refresh token and access token provided do not belong to the same user'
  //     );
  //   }

  //   return {
  //     accessToken: new Token({
  //       tokenType: 'access',
  //       token: foundAccessTokenData.token,
  //     }),
  //     refreshToken: new Token({
  //       tokenType: 'refresh',
  //       token: foundRefreshTokenData.token,
  //     }),
  //   };
  // // }

  // static async fetchToken(
  //   tokenString: string,
  //   tokenType: TokenType
  // ): Promise<Token> {
  //   const tokenData = await TokenRepository.fetchTokenData(tokenString);
  //   if (!tokenData) {
  //     throw new Error('Token not found');
  //   }

  //   const token = new Token({
  //     tokenType: tokenType,
  //     token: tokenData.token,
  //   });

  //   return token;
  // }

  async createTokens(
    account: Account,
    userSessionId: UserSessionAttributes['id']
  ): Promise<Tokens> {
    const accessToken: Token = await this.createToken(
      account,
      userSessionId,
      'access'
    );
    const refreshToken: Token = await this.createToken(
      account,
      userSessionId,
      'refresh'
    );
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async createToken(
    account: Account,
    userSessionId: UserSessionAttributes['id'],
    tokenType: TokenType,
    transaction?: Transaction
  ) {
    const payload: UserJwtPayload = {
      userId: account.getAccountId(),
      profileId: account.getProfileId(),
      accountRole: account.getAccountRole(),
    };
    const token = new Token({
      tokenType: tokenType,
      userSessionId: userSessionId,
      tokenPayload: payload,
    });
    return token;
  }

  async saveTokensFromUserSession(
    userSession: UserSession,
    transaction: Transaction
  ): Promise<void> {
    const accessTokens = userSession.getAccessTokens();

    for (const [seq, accessToken] of accessTokens) {
      await this.tokenRepository.saveTokenAttributes(
        {
          token: accessToken.getToken(),
          userSessionId: userSession.getId(),
          seq: seq,
          tokenType: accessToken.getTokenType(),
          tokenExpiresTime: accessToken.getTokenExpiresTime(),
          isActive:
            userSession.getIsActive() &&
            userSession.getActiveAccessToken() === accessToken,
          issuedAt: accessToken.getIssuedAtTime(),
        },
        transaction
      );
    }

    const refreshTokens = userSession.getRefreshTokens();
    for (const [seq, refreshToken] of refreshTokens) {
      await this.tokenRepository.saveTokenAttributes(
        {
          token: refreshToken.getToken(),
          userSessionId: userSession.getId(),
          seq: seq,
          tokenType: refreshToken.getTokenType(),
          tokenExpiresTime: refreshToken.getTokenExpiresTime(),
          isActive:
            userSession.getIsActive() &&
            userSession.getActiveRefreshToken() === refreshToken,
          issuedAt: refreshToken.getIssuedAtTime(),
        },
        transaction
      );
    }
  }
}
