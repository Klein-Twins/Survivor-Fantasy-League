import { Account } from '../../domain/account/Account';
import { UserSession } from '../../domain/account/UserSession';
import {
  LoginUserRequestBody,
  SignupUserRequestBody,
} from '../../generated-api';
import { AccountRepository } from '../../repositories/account/AccountRepository';
import { UnauthorizedError } from '../../utils/errors/errors';
import { AccountService } from './AccountService';
import { UserSessionService } from './UserSessionService';

export class AuthService {
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
  static async signup({
    email,
    password,
    userName,
    firstName,
    lastName,
  }: SignupUserRequestBody): Promise<UserSession> {
    const account: Account = await AccountService.createAccount({
      email,
      password,
      userName,
      firstName,
      lastName,
    });

    const userSession: UserSession = new UserSession({
      account,
    });

    await userSession.startUserSession();

    return userSession;
  }

  static async login({
    email,
    password,
  }: LoginUserRequestBody): Promise<UserSession> {
    const account = await AccountRepository.getAccountByField('email', email);
    const isAuthenticated = await account.authenticateAccount(password);
    if (!isAuthenticated) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const userSession: UserSession = new UserSession({
      account,
    });

    await userSession.startUserSession();

    return userSession;
  }

  static async logout({
    accessToken,
    refreshToken,
  }: {
    accessToken: string;
    refreshToken: string;
  }): Promise<UserSession> {
    const userSession = await UserSessionService.fetchUserSessionByTokens({
      accessToken,
      refreshToken,
    });
    await userSession.endUserSession();

    return userSession;
  }
}
