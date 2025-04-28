import { Account } from '../../domain/account/Account';
import { PasswordRepository } from '../../repositories/account/passwordRepository';
import bcrypt from 'bcrypt';

export class PasswordService {
  static async authenticateAccount(
    account: Account,
    password: string
  ): Promise<boolean> {
    const savedActivePassword = await PasswordRepository.getActivePassword(
      account.getAccountId()
    );

    const isSamePassword = await bcrypt.compare(password, savedActivePassword);

    return isSamePassword;
  }
}
