import { injectable } from 'tsyringe';
import validator from 'validator';
import { Account } from '../../domain/account/Account';
import { models } from '../../config/db';
import { UserAttributes } from '../../models/account/User';

@injectable()
export class AccountStorageHelper {
  constructor() {}
  async getAccountIdByAccountId(
    accountId: Account['accountId']
  ): Promise<Account['accountId'] | undefined> {
    if (!validator.isUUID(accountId)) {
      throw new Error('Invalid account ID format');
    }
    return accountId as Account['accountId'];
  }

  async getAccountIdByProfileId(
    profileId: Account['profileId']
  ): Promise<Account['accountId'] | undefined> {
    if (!validator.isUUID(profileId)) {
      throw new Error('Invalid profile ID format');
    }

    const account = await models.User.findOne({
      where: {
        profileId,
      },
    });

    if (!account) {
      return undefined;
    }

    return account.userId;
  }

  async getAccountIdByEmail(
    email: UserAttributes['email']
  ): Promise<Account['accountId'] | undefined> {
    if (!validator.isEmail(email)) {
      throw new Error('Invalid email format');
    }

    const account = await models.User.findOne({
      where: {
        email,
      },
    });

    if (!account) {
      return undefined;
    }

    return account.userId;
  }

  async getAccountIdByUserName(
    userName: UserAttributes['userName']
  ): Promise<Account['accountId'] | undefined> {
    if (!validator.isAlphanumeric(userName)) {
      throw new Error('Invalid username format');
    }

    const account = await models.User.findOne({
      where: {
        userName,
      },
    });

    if (!account) {
      return undefined;
    }

    return account.userId;
  }
}
