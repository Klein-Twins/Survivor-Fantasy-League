import { inject, injectable } from 'tsyringe';
import { Account } from '../../domain/account/Account';
import { UserSession, UserSessions } from '../../domain/account/UserSession';
import { AccountRepository } from '../../repositories/account/AccountRepository';
import { InternalServerError } from '../../utils/errors/errors';
import { Tokens, TokenService } from './TokenService';
import { Transaction } from 'sequelize';
import { UserSessionRepository } from '../../repositories/account/UserSessionRepository';
import { v4 } from 'uuid';
import { UUID } from 'crypto';
import sequelize from '../../config/db';

@injectable()
export class UserSessionService {
  constructor(
    @inject(TokenService) private tokenService: TokenService,
    @inject(UserSessionRepository)
    private userSessionRepository: UserSessionRepository
  ) {}

  async fetchUserSessions(account: Account): Promise<UserSessions> {
    const userSessions = new UserSessions(account);

    const userSessionsData = await this.userSessionRepository.getUserSessions(
      account.getAccountId()
    );

    for (const userSessionData of userSessionsData) {
      const userSession = new UserSession({
        account: account,
        id: userSessionData.id,
        endTime: userSessionData.endTime,
        startTime: userSessionData.startTime,
        expectedEndTime: userSessionData.expectedEndTime,
      });

      const tokens = await this.tokenService.fetchTokensForUserSession(
        userSession
      );

      const isUserSessionActive = userSession.getIsActive();
      if (isUserSessionActive) {
        userSessions.setActiveUserSession(userSession);
      } else {
        userSessions.addInactiveUserSession(userSession);
      }
    }

    account.setUserSessions(userSessions);
    return userSessions;
  }

  async createAndStartNewUserSession(account: Account): Promise<UserSession> {
    const userSessionId = v4() as UUID;

    const tokens = await this.tokenService.createTokens(account, userSessionId);

    const userSession = new UserSession({
      account: account,
      id: userSessionId,
      startTime: tokens.refreshToken.getIssuedAtTime(),
      expectedEndTime: tokens.refreshToken.getTokenExpiresTime(),
    });

    userSession.setActiveAccessToken(tokens.accessToken);
    userSession.setActiveRefreshToken(tokens.refreshToken);

    account.setActiveUserSession(userSession);

    const transaction = await sequelize.transaction();
    try {
      await this.saveUserSession(userSession, transaction);
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new InternalServerError('Failed to save user session: ' + error);
    }
    return userSession;
  }

  async endUserSession(account: Account): Promise<UserSession> {
    const userSession = account.getActiveUserSession();
    if (!userSession) {
      throw new InternalServerError('No active user session found');
    }

    userSession.deactivateUserSession();
    const transaction = await sequelize.transaction();
    try {
      await this.saveUserSession(userSession, transaction);
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new InternalServerError('Failed to save user session: ' + error);
    }

    return userSession;
  }

  async saveUserSession(
    userSession: UserSession,
    transaction: Transaction
  ): Promise<void> {
    await this.userSessionRepository.saveUserSessionAttributes(
      {
        id: userSession.getId(),
        startTime: userSession.getStartTime(),
        endTime: userSession.getEndTime(),
        expectedEndTime: userSession.getExpectedEndTime(),
        accountId: userSession.getAccount().getAccountId(),
      },
      transaction
    );

    await this.tokenService.saveTokensFromUserSession(userSession, transaction);
  }
}
