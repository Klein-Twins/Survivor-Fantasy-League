import { Token } from './Token';
import { Account } from './Account';
import { UserSessionService } from '../../services/account/UserSessionService';
import { TokenService } from '../../services/account/TokenService';
import logger from '../../config/logger';
import { InternalServerError } from '../../utils/errors/errors';
import { UserSession as UserSessionDTO } from '../../generated-api';

export class UserSession {
  private account: Account;
  private isActive: boolean;
  private accessToken: Token | null;
  private refreshToken: Token | null;

  constructor(
    params:
      | {
          account: Account;
          accessToken?: never;
          refreshToken?: never;
        }
      | {
          account: Account;
          accessToken: Token;
          refreshToken: Token;
        }
  ) {
    if (!params.refreshToken) {
      this.isActive = false;
      this.account = params.account;
      this.accessToken = null;
      this.refreshToken = null;
    } else if (params.refreshToken && params.accessToken) {
      this.isActive = !params.refreshToken.isTokenExpired();
      this.account = params.account;
      this.accessToken = params.accessToken;
      this.refreshToken = params.refreshToken;
    } else {
      throw new Error(
        'Either accessToken and refreshToken must be provided or none of them'
      );
    }
  }

  async startUserSession(): Promise<UserSession> {
    if (this.isActive) {
      logger.error('User session is already active');
      throw new InternalServerError(
        'User session is already active. Cannot start a new session.'
      );
    }

    if (this.accessToken || this.refreshToken) {
      logger.error(
        'User session already has tokens - must refresh the session if so'
      );
      throw new InternalServerError(
        'User session already has tokens. Cannot start a new session.'
      );
    }
    const tokens = await TokenService.createTokens(this.account);
    this.accessToken = tokens.accessToken;
    this.refreshToken = tokens.refreshToken;

    await UserSessionService.saveStartUserSession(this);
    this.isActive = true;
    return this;
  }

  async endUserSession(): Promise<UserSession> {
    if (!this.isActive) {
      logger.error('User session is already inactive');
      throw new InternalServerError(
        'User session is already inactive. Cannot end a session.'
      );
    }

    await UserSessionService.saveEndUserSession(this);
    this.accessToken = null;
    this.refreshToken = null;
    this.isActive = false;

    return this;
  }

  getAccount(): Account {
    return this.account;
  }

  getIsActive(): boolean {
    return this.isActive;
  }

  getAccessToken(): Token | null {
    return this.accessToken;
  }

  getRefreshToken(): Token | null {
    return this.refreshToken;
  }

  toDTO(): UserSessionDTO {
    return {
      isAuthenticated: this.isActive,
    };
  }
}
