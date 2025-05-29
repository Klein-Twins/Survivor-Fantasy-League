import { Transaction } from 'sequelize';
import { Account } from '../../domain/account/Account';
import { TokenType } from '../../models/account/Tokens';
import { UserJwtPayload } from '../../types/auth/tokenTypes';
import { TokenRepository } from '../../repositories/account/TokenRepository';
import {} from '../../utils/errors/errors';
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

  async fetchTokensForUserSession(userSession: UserSession): Promise<Token[]> {
    const tokensDataInUserSession =
      await this.tokenRepository.fetchTokensInUserSession(userSession.getId());

    const tokens: Token[] = [];

    for (const tokenData of tokensDataInUserSession) {
      const token = new Token({
        tokenType: tokenData.tokenType,
        userSessionId: tokenData.userSessionId,
        tokenEndTime: tokenData.tokenEndTime,
        tokenValue: tokenData.token,
      });
      tokens.push(token);

      if (tokenData.tokenType === 'access') {
        userSession.addAccessToken(token, tokenData.seq, tokenData.isActive);
      } else if (tokenData.tokenType === 'refresh') {
        userSession.addRefreshToken(token, tokenData.seq, tokenData.isActive);
      }
    }

    return tokens;
  }

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

  createTokens(
    account: Account,
    userSessionId: UserSessionAttributes['id']
  ): Tokens {
    const accessToken: Token = this.createToken(
      account,
      userSessionId,
      'access'
    );
    const refreshToken: Token = this.createToken(
      account,
      userSessionId,
      'refresh'
    );
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  createToken(
    account: Account,
    userSessionId: UserSessionAttributes['id'],
    tokenType: TokenType,
    transaction?: Transaction
  ): Token {
    const payload: UserJwtPayload = {
      userId: account.getAccountId(),
      profileId: account.getProfileId(),
      accountRole: account.getAccountRole(),
    };
    const token = new Token({
      tokenType: tokenType,
      userSessionId: userSessionId,
      tokenPayload: payload,
      tokenEndTime: null,
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
          tokenEndTime: accessToken.getTokenEndTime(),
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
          tokenEndTime: refreshToken.getTokenEndTime(),
        },
        transaction
      );
    }
  }
}
