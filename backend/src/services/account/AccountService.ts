import { inject, injectable } from 'tsyringe';
import sequelize from '../../config/db';
import { Account } from '../../domain/account/Account';
import { AccountRole } from '../../generated-api';
import { AccountHelper } from '../../helpers/account/AccountHelper';
import { AccountRepository } from '../../repositories/account/AccountRepository';
import { ConflictError } from '../../utils/errors/errors';
import { AccountStorage } from '../../storage/account/AccountStorage';
import logger from '../../config/logger';
import { PasswordAttributes } from '../../models/account/Password';

@injectable()
export class AccountService {
  constructor(
    @inject(AccountStorage) private accountStorage: AccountStorage,
    @inject(AccountRepository) private accountRepository: AccountRepository,
    @inject(AccountHelper) private accountHelper: AccountHelper
  ) {}

  async createAccount({
    email,
    password,
    userName,
    firstName,
    lastName,
  }: {
    email: string;
    password: string;
    userName: string;
    firstName: string;
    lastName: string;
  }): Promise<Account> {
    //Check if the email and username are available
    if ((await this.accountHelper.isEmailAvailable(email)) === false) {
      throw new ConflictError('Email is already in use');
    }
    if ((await this.accountHelper.isUserNameAvailable(userName)) === false) {
      throw new ConflictError('Username is already in use');
    }

    this.accountHelper.validateCreateAccountInput({
      email,
      password,
      userName,
      firstName,
      lastName,
    });

    const passwordAttributes: Pick<
      PasswordAttributes,
      'password' | 'passwordSeq'
    > = {
      password: password,
      passwordSeq: 1,
    };

    const account = new Account({
      email,
      accountRole: AccountRole.User,
      firstName,
      lastName,
      userName,
      passwordsAttributes: [passwordAttributes],
    });

    const transaction = await sequelize.transaction();
    try {
      await this.accountRepository.saveAccount(account, transaction);
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }

    // Add the account to the storage
    this.accountStorage.addAccount(account);

    return account;
  }

  /**
   * @description Fetches an account by the given field and value. It will check the cache first, and if not found, it will fetch from the database.
   * @param field The field to search by - userName, accountId, profileId, or email
   * @param value The value to search for - userName, accountId, profileId, or email
   * @returns The account object
   * @throws NotFoundError if the account is not found in the database or cache
   */
  async fetchAccount(
    field: 'userName' | 'accountId' | 'profileId' | 'email',
    value:
      | Account['userName']
      | Account['accountId']
      | Account['profileId']
      | Account['email']
  ): Promise<Account> {
    const cachedAccount = await this.accountStorage.getAccount({
      field,
      value,
    });
    if (cachedAccount) {
      logger.debug(
        `Account ${cachedAccount.getAccountId()} fetched from cache`
      );
      return cachedAccount;
    }
    logger.debug(`Account ${value} not found in cache, fetching from DB`);

    const accountData = await this.accountRepository.fetchAccountDataByField({
      field,
      value,
    });

    const account = new Account({
      accountId: accountData.userId,
      email: accountData.email,
      userName: accountData.userName,
      profileId: accountData.profileId,
      firstName: accountData.profile.firstName,
      lastName: accountData.profile.lastName,
      accountRole: accountData.userRole,
      passwordsAttributes: accountData.passwords,
    });

    this.accountStorage.addAccount(account);
    return account;
  }
}
