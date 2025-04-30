import { inject, injectable, singleton } from 'tsyringe';
import { Account } from '../../domain/account/Account';
import { UserAttributes } from '../../models/account/User';
import { models } from '../../config/db';
import validator from 'validator';
import { AccountStorageHelper } from './AccountStorageHelper';

@singleton()
export class AccountStorage {
  private accounts: Map<Account['accountId'], Account>;

  constructor(
    @inject(AccountStorageHelper)
    private accountStorageHelper: AccountStorageHelper
  ) {
    this.accounts = new Map<Account['accountId'], Account>();
  }

  /**
   * This method is used to add an account to the storage.
   * @param account Account to add to the storage
   * @param overwrite Optional parameter to overwrite an existing account
   */
  addAccount(account: Account, overwrite: boolean = false): void {
    if (this.accounts.has(account.getAccountId()) && !overwrite) {
      throw new Error('Account already exists');
    }
    this.accounts.set(account.getAccountId(), account);
  }

  async getAccount({
    field,
    value,
  }: {
    field: 'userName' | 'accountId' | 'profileId' | 'email';
    value:
      | Account['userName']
      | Account['accountId']
      | Account['profileId']
      | Account['email'];
  }): Promise<Account | undefined> {
    let accountId: Account['accountId'] | undefined = undefined;

    switch (field) {
      case 'accountId':
        accountId = await this.accountStorageHelper.getAccountIdByAccountId(
          value as Account['accountId']
        );
        break;
      case 'userName':
        accountId = await this.accountStorageHelper.getAccountIdByUserName(
          value as Account['userName']
        );
        break;
      case 'profileId':
        accountId = await this.accountStorageHelper.getAccountIdByProfileId(
          value as Account['profileId']
        );
        break;
      case 'email':
        accountId = await this.accountStorageHelper.getAccountIdByEmail(
          value as Account['email']
        );
        break;
      default:
        throw new Error('Invalid field to fetch account from storage');
    }
    if (!accountId) {
      return undefined;
    }

    return this.accounts.get(accountId);
  }
}
