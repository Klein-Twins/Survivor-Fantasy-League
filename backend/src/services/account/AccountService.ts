import sequelize from '../../config/db';
import { Account } from '../../domain/account/Account';
import { AccountRole } from '../../generated-api';
import { AccountHelper } from '../../helpers/account/AccountHelper';
import { AccountRepository } from '../../repositories/account/AccountRepository';
import { ConflictError } from '../../utils/errors/errors';

export class AccountService {
  static async createAccount({
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
    if ((await AccountHelper.isEmailAvailable(email)) === false) {
      throw new ConflictError('Email is already in use');
    }
    if ((await AccountHelper.isUserNameAvailable(userName)) === false) {
      throw new ConflictError('Username is already in use');
    }

    // const hashedPassword = await PasswordHelper.hashPassword(password);

    const account = new Account({
      email,
      accountRole: AccountRole.User,
      firstName,
      lastName,
      userName,
    });

    const transaction = await sequelize.transaction();
    try {
      await AccountRepository.saveAccount(account, password, transaction);
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }

    return account;
  }
}
