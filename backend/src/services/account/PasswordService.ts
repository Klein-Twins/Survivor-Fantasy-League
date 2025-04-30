import { inject, injectable } from 'tsyringe';
import { Account } from '../../domain/account/Account';
import bcrypt from 'bcrypt';
import { Password, Passwords } from '../../domain/account/Passwords';
import { PasswordRepository } from '../../repositories/account/PasswordRepository';
import { Transaction } from 'sequelize';
import { PasswordAttributes } from '../../models/account/Password';

@injectable()
export class PasswordService {
  constructor(
    @inject(PasswordRepository) private passwordRepository: PasswordRepository
  ) {}

  async fetchPasswords(account: Account): Promise<Passwords> {
    const passwords = new Passwords(account);

    const passwordHistoryData: PasswordAttributes[] =
      await this.passwordRepository.getPasswordHistory(account.getAccountId());

    for (const passwordData of passwordHistoryData) {
      passwords.addPassword(
        new Password(passwordData.passwordSeq, passwordData.password)
      );
    }

    account.setPasswords(passwords);

    return passwords;
  }

  async createPasswordForAccount(
    account: Account,
    password: string,
    seq: number
  ): Promise<void> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const passwordObject: Password = new Password(seq, hashedPassword);
    account.addNewPassword(passwordObject);
  }

  async authenticateAccount(
    account: Account,
    password: string
  ): Promise<boolean> {
    const savedActivePassword = await this.passwordRepository.getActivePassword(
      account.getAccountId()
    );

    const isSamePassword = await bcrypt.compare(password, savedActivePassword);

    return isSamePassword;
  }

  async savePasswordsOnAccount(
    account: Account,
    transaction: Transaction
  ): Promise<void> {
    for (const [seq, password] of account.getPasswordHistory()) {
      await this.passwordRepository.savePassword(
        password,
        account.getAccountId(),
        transaction
      );
    }
  }
}
