import { Token } from './Token';
import { Account } from './Account';
import { InternalServerError } from '../../utils/errors/errors';
import { UUID } from 'crypto';
import { v4 } from 'uuid';
import { UserSession as UserSessionDTO } from '../../generated-api';

export class UserSessions {
  private account: Account;
  private userSessionHistory: UserSession[] = [];
  private currentUserSession: UserSession | null = null;

  constructor(account: Account, userSessionHistory: UserSession[] = []) {
    this.userSessionHistory = userSessionHistory;
    this.account = account;
  }

  getUserSessionHistory(): UserSession[] {
    return this.userSessionHistory;
  }

  getCurrentUserSession(): UserSession | null {
    return this.currentUserSession;
  }

  setActiveUserSession(userSession: UserSession): void {
    this.currentUserSession = userSession;
    this.userSessionHistory.push(userSession);
  }

  getAccount(): Account {
    return this.account;
  }
}

export class UserSession {
  private id: UUID;
  private startTime: Date;
  private endTime: Date | null;
  private expectedEndTime: Date;
  private account: Account;
  private activeAccessToken: Token | null = null;
  private activeRefreshToken: Token | null = null;
  private accessTokens: Map<number, Token>;
  private refreshTokens: Map<number, Token>;

  constructor({
    account,
    id,
    startTime,
    endTime = null,
    expectedEndTime,
    accessTokens = new Map(),
    refreshTokens = new Map(),
  }: {
    account: Account;
    id: UUID;
    startTime: Date;
    endTime?: Date | null;
    expectedEndTime: Date;
    accessTokens?: Map<number, Token>;
    refreshTokens?: Map<number, Token>;
  }) {
    this.id = id;
    this.startTime = startTime;
    this.endTime = endTime;
    this.expectedEndTime = expectedEndTime;
    this.account = account;
    this.accessTokens = accessTokens;
    this.refreshTokens = refreshTokens;
  }

  deactivateUserSession(): void {
    this.activeAccessToken?.endToken();
    this.activeRefreshToken?.endToken();
    this.activeAccessToken = null;
    this.activeRefreshToken = null;
    this.endTime = new Date();
  }

  setActiveAccessToken(token: Token): void {
    this.activeAccessToken = token;
    this.accessTokens.set(this.accessTokens.size + 1, token);
  }
  setActiveRefreshToken(token: Token): void {
    this.activeRefreshToken = token;
    this.refreshTokens.set(this.refreshTokens.size + 1, token);
  }

  getIsActive(): boolean {
    const currentTime = new Date();
    if (
      this.activeAccessToken &&
      this.activeRefreshToken &&
      this.startTime &&
      this.startTime < currentTime &&
      this.expectedEndTime &&
      this.expectedEndTime > currentTime
    ) {
      if (this.endTime && this.endTime < currentTime) {
        return false;
      }
      return true;
    }
    return false;
  }

  getId(): UUID {
    return this.id;
  }
  getStartTime(): Date {
    return this.startTime;
  }
  getEndTime(): Date | null {
    return this.endTime;
  }
  getExpectedEndTime(): Date {
    return this.expectedEndTime;
  }
  getAccount(): Account {
    return this.account;
  }
  getAccessTokens(): Map<number, Token> {
    return this.accessTokens;
  }
  getRefreshTokens(): Map<number, Token> {
    return this.refreshTokens;
  }

  getActiveAccessToken(): Token | null {
    return this.activeAccessToken;
  }
  getActiveRefreshToken(): Token | null {
    return this.activeRefreshToken;
  }

  setEndTime(endTime: Date): void {
    this.endTime = endTime;
  }

  toDTO(): UserSessionDTO {
    return {
      isAuthenticated: this.getIsActive(),
    };
  }
}

//Case 1: UserSession is fetched from the database
//Case 2: UserSession is created in memory
/*
export class UserSession {
  private account: Account;
  private userSessionId: UUID;
  private startTime: Date | null;
  private endTime: Date | null;
  private expectedEndTime: Date | null;
  private isActive: boolean = false;
  private activeTokens: {
    accessToken: Token;
    refreshToken: Token;
  } | null;

  private accessTokenHistory: Map<number, Token> = new Map();
  private refreshTokenHistory: Map<number, Token> = new Map();

  constructor({
    account,
    userSessionId = v4() as UUID,
    startTime = null,
    endTime = null,
    expectedEndTime = null,
    accessTokenHistory,
    refreshTokenHistory,
  }: {
    account: Account;
    userSessionId?: UserSessionAttributes['id'];
    startTime?: UserSession['startTime'];
    endTime?: UserSession['endTime'];
    expectedEndTime?: UserSession['expectedEndTime'];
    accessTokenHistory?: Map<number, Token>;
    refreshTokenHistory?: Map<number, Token>;
  }) {
    this.userSessionId = userSessionId;
    this.account = account;
    this.activeTokens = null;
    this.startTime = startTime || null;
    this.endTime = endTime || null;
    this.expectedEndTime = expectedEndTime || null;
    this.accessTokenHistory = accessTokenHistory || new Map();
    this.refreshTokenHistory = refreshTokenHistory || new Map();
  }

  async startUserSession(): Promise<UserSession> {
    if (this.isActive) {
      throw new InternalServerError('User session is already active');
    }

    const tokenService = container.resolve(TokenService);

    const tokens = await tokenService.createTokens(
      this.account,
      this.userSessionId
    );

    this.activeTokens = tokens;
    this.isActive = true;

    const accessTokenSeq = this.accessTokenHistory.size + 1;
    const refreshTokenSeq = this.refreshTokenHistory.size + 1;

    if (this.accessTokenHistory.has(accessTokenSeq)) {
      throw new InternalServerError(
        `Access token with sequence ${accessTokenSeq} already exists in history`
      );
    }
    this.accessTokenHistory.set(accessTokenSeq, tokens.accessToken);

    if (this.refreshTokenHistory.has(refreshTokenSeq)) {
      throw new InternalServerError(
        `Refresh token with sequence ${refreshTokenSeq} already exists in history`
      );
    }
    this.refreshTokenHistory.set(refreshTokenSeq, tokens.refreshToken);

    return this;
  }

  async endUserSession(): Promise<UserSession> {
    if (!this.isActive) {
      throw new InternalServerError('User session is already inactive');
    }

    const activeAccessToken = this.activeTokens?.accessToken;
    const activeRefreshToken = this.activeTokens?.refreshToken;

    if (!activeAccessToken || !activeRefreshToken) {
      throw new InternalServerError(
        'User session does not have tokens stored. Cannot end session.'
      );
    }

    activeAccessToken.endToken();
    activeRefreshToken.endToken();
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
    return this.activeTokens?.accessToken || null;
  }
  getRefreshToken(): Token | null {
    return this.activeTokens?.refreshToken || null;
  }
  getUserSessionId(): UUID {
    return this.userSessionId;
  }
  getAccessTokenHistory(): Map<number, Token> {
    return this.accessTokenHistory;
  }
}
  */

/*
export class UserSession {
  private account: Account;
  private userSessionId: UUID;
  private activeRefreshToken: Token;
  private activeAccessToken: Token;
  private accessTokensInSession: Token | null;
  private refreshTokensInSession: Token | null;

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
*/
