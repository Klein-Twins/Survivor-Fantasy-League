import { injectable } from 'tsyringe';
import { Account } from '../../domain/account/Account';
import { PasswordRepository } from '../../repositories/account/passwordRepository';
import bcrypt from 'bcrypt';

@injectable()
export class PasswordService {
  async authenticateAccount(
    account: Account,
    password: string
  ): Promise<boolean> {
    const savedActivePassword = await PasswordRepository.getActivePassword(
      account.getAccountId()
    );

    const isSamePassword = await bcrypt.compare(password, savedActivePassword);

    return isSamePassword;
  }

  async savePasswordsOnAccount(account: Account): Promise<void> {
    const passwords = account.getPasswords();
    const accountId = account.getAccountId();
  }
}
