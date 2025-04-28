import { Transaction } from 'sequelize';
import { Account } from '../../domain/account/Account';
import logger from '../../config/logger';
import { UUID } from 'crypto';
import {
  InternalServerError,
  NotFoundError,
  NotImplementedError,
} from '../../utils/errors/errors';
import validator from 'validator';
import { UserAttributes } from '../../models/account/User';
import { ProfileAttributes } from '../../models/account/Profile';
import { UserRepository } from './UserRepository';
import { ProfileRepository } from './ProfileRepository';
import { PasswordRepository } from './PasswordRepository';

export class AccountRepository {
  static async getAccountByField(
    field: 'userName' | 'accountId' | 'profileId' | 'email',
    value: string | UUID
  ) {
    logger.debug(`Getting account by ${field}: ${value}`);
    let account: Account | null = null;
    switch (field) {
      case 'userName':
        // account = await UserRepository.getUserByUserName(value as string);
        throw new NotImplementedError(
          'getUserByUserName is not implemented yet'
        );
        break;
      case 'accountId':
        account = await AccountRepository.getAccountById(value as UUID);

        break;
      case 'profileId':
        account = await AccountRepository.getAccountByProfileId(value as UUID);
        break;
      case 'email':
        if (!validator.isEmail(value)) {
          throw new InternalServerError('Invalid email format');
        }
        const email = value;
        account = await AccountRepository.getAccountByEmail(email);
        break;
      default:
        throw new Error('Invalid field');
    }
    return account;
  }

  private static async getAccountByProfileId(profileId: UUID) {
    const userAttributes: UserAttributes | null =
      await UserRepository.getUserByProfileId(profileId);

    if (!userAttributes) {
      throw new NotFoundError('User not found');
    }

    const profileAttributes: ProfileAttributes | null =
      await ProfileRepository.getProfileByProfileId(userAttributes.profileId);
    if (!profileAttributes) {
      throw new NotFoundError('Profile not found');
    }

    const account = new Account({
      accountId: userAttributes.userId,
      email: userAttributes.email,
      userName: userAttributes.userName,
      accountRole: userAttributes.userRole,
      firstName: profileAttributes.firstName,
      lastName: profileAttributes.lastName,
      profileId: userAttributes.profileId,
    });

    return account;
  }

  private static async getAccountById(id: UserAttributes['userId']) {
    const userAttributes: UserAttributes | null =
      await UserRepository.getUserByUserId(id);

    if (!userAttributes) {
      throw new NotFoundError('User not found');
    }

    const profileAttributes: ProfileAttributes | null =
      await ProfileRepository.getProfileByProfileId(userAttributes.profileId);
    if (!profileAttributes) {
      throw new NotFoundError('Profile not found');
    }

    const account = new Account({
      accountId: userAttributes.userId,
      email: userAttributes.email,
      userName: userAttributes.userName,
      accountRole: userAttributes.userRole,
      firstName: profileAttributes.firstName,
      lastName: profileAttributes.lastName,
      profileId: userAttributes.profileId,
    });

    return account;
  }

  private static async getAccountByEmail(email: string): Promise<Account> {
    const userAttributes: UserAttributes | null =
      await UserRepository.getUserByEmail(email);
    if (!userAttributes) {
      throw new NotFoundError('User not found');
    }

    const profileAttributes: ProfileAttributes | null =
      await ProfileRepository.getProfileByProfileId(userAttributes.profileId);
    if (!profileAttributes) {
      throw new NotFoundError('Profile not found');
    }

    const account = new Account({
      accountId: userAttributes.userId,
      email: userAttributes.email,
      userName: userAttributes.userName,
      accountRole: userAttributes.userRole,
      firstName: profileAttributes.firstName,
      lastName: profileAttributes.lastName,
      profileId: userAttributes.profileId,
    });

    return account;
  }

  /**
   * Saves the account to the database.
   * @param account The account to save.
   * @param password The password to save.
   * @param transaction The transaction to use.
   */
  static async saveAccount(
    account: Account,
    password: string,
    transaction: Transaction
  ): Promise<void> {
    logger.debug(`Saving ${account.toString()}`);
    await ProfileRepository.saveProfileAttributes(
      {
        firstName: account.getFirstName(),
        lastName: account.getLastName(),
        profileId: account.getProfileId(),
      },
      transaction
    );

    await UserRepository.saveUserAttributes(
      {
        userId: account.getAccountId(),
        userName: account.getUserName(),
        email: account.getEmail(),
        profileId: account.getProfileId(),
        userRole: account.getAccountRole(),
      },
      transaction
    );

    await PasswordRepository.saveNewPassword(
      {
        password,
        userId: account.getAccountId(),
      },
      transaction
    );

    logger.debug(`Saved ${account.toString()}`);
  }
}
