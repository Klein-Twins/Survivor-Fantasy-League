import { container, inject, injectable } from 'tsyringe';
import { Account } from '../../domain/account/Account';
import { UserSession } from '../../domain/account/UserSession';
import {
  LoginUserRequestBody,
  SignupUserRequestBody,
} from '../../generated-api';
import { BadRequestError, UnauthorizedError } from '../../utils/errors/errors';
import { AccountService } from './AccountService';
import { UserSessionService } from './UserSessionService';
import { TokenHelper } from '../../helpers/account/TokenHelper';
import logger from '../../config/logger';

@injectable()
export class AuthService {
  constructor(
    @inject(AccountService)
    private accountService: AccountService,
    @inject(UserSessionService)
    private userSessionService: UserSessionService,
    @inject(TokenHelper)
    private tokenHelper: TokenHelper
  ) {}

  /**
   * @param email
   * @param password
   * @param userName
   * @param firstName
   * @param lastName
   * @returns {Promise<Account>} A promise that resolves to the created account
   * @throws {ConflictError} If the email or username is already in use
   * @throws {BadRequestError} If the password is not strong enough
   *
   */
  async signup({
    email,
    password,
    userName,
    firstName,
    lastName,
  }: SignupUserRequestBody): Promise<{
    account: Account;
    userSession: UserSession;
  }> {
    const account: Account = await this.accountService.createAccount({
      email,
      password,
      userName,
      firstName,
      lastName,
    });

    const userSession: UserSession =
      await this.userSessionService.createAndStartNewUserSession(account);

    return { account, userSession };
  }

  async login({ email, password }: LoginUserRequestBody): Promise<{
    account: Account;
    userSession: UserSession;
  }> {
    const account = await this.accountService.fetchAccount('email', email);
    const isAuthenticated = await account.authenticateAccount(password);
    if (!isAuthenticated) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const userSession: UserSession =
      await this.userSessionService.createAndStartNewUserSession(account);

    return {
      account,
      userSession,
    };
  }

  async logout({
    accessToken,
    refreshToken,
  }: {
    accessToken: string;
    refreshToken: string;
  }): Promise<{ account: Account; userSession: UserSession }> {
    const decodedAccessToken = this.tokenHelper.decodeToken(accessToken);
    const decodedRefreshToken = this.tokenHelper.decodeToken(refreshToken);

    if (!decodedAccessToken || !decodedRefreshToken) {
      throw new BadRequestError('Invalid token');
    }

    const eqPayloads = this.tokenHelper.validateTokenPayloadsEqual(
      decodedAccessToken,
      decodedRefreshToken
    );

    if (!eqPayloads) {
      logger.warn('Token payloads do not match');
    }

    const userId = decodedRefreshToken.userId;

    const account = await this.accountService.fetchAccount('accountId', userId);

    const userSession = await this.userSessionService.endUserSession(account);

    return {
      account,
      userSession,
    };
  }
}
