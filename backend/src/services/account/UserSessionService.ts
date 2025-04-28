import { Account } from '../../domain/account/Account';
import { UserSession } from '../../domain/account/UserSession';
import { AccountRepository } from '../../repositories/account/AccountRepository';
import { InternalServerError } from '../../utils/errors/errors';
import { Tokens, TokenService } from './TokenService';

export class UserSessionService {
  static async fetchUserSessionByTokens({
    accessToken,
    refreshToken,
  }: {
    accessToken: string;
    refreshToken: string;
  }): Promise<UserSession> {
    const tokens: Tokens = await TokenService.fetchTokens({
      accessToken,
      refreshToken,
    });

    const account: Account = await AccountRepository.getAccountByField(
      'accountId',
      tokens.refreshToken.getPayload().userId
    );

    const userSession: UserSession = new UserSession({
      account,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });

    return userSession;
  }

  static async saveStartUserSession(userSession: UserSession) {
    const account: Account = userSession.getAccount();
    const accessToken = userSession.getAccessToken();
    const refreshToken = userSession.getRefreshToken();

    if (!accessToken || !refreshToken) {
      throw new InternalServerError(
        'User session does not have tokens stored. Cannot save tokens to database to start a new session.'
      );
    }

    const tokens: Tokens = {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };

    await TokenService.saveTokensForStartUserSession(account, tokens);
  }

  static async saveEndUserSession(userSession: UserSession) {
    const account: Account = userSession.getAccount();
    const accessToken = userSession.getAccessToken();
    const refreshToken = userSession.getRefreshToken();

    if (!accessToken || !refreshToken) {
      throw new InternalServerError(
        'User session does not have tokens stored. Cannot save tokens to database to end a session.'
      );
    }

    await TokenService.saveTokensForEndUserSession(
      account,
      accessToken,
      refreshToken
    );
  }
}
