import logger from '../../config/logger';
import { PasswordAttributes } from '../../models/account/Password';
import { Account } from './Account';

export class Passwords {
  private account: Account;
  private passwordHistory: Map<number, Password> = new Map();
  private activePassword: Password | null = null;

  constructor(account: Account) {
    this.account = account;
  }

  addPassword(password: Password): void {
    if (this.passwordHistory.has(password.getSeq())) {
      logger.warn(
        `Password with seq ${password.getSeq()} already exists in history.`
      );
      return;
    }

    //If first password, set as active
    if (!this.activePassword) {
      this.activePassword = password;
    }
    //if newer password, inactivate the current active password
    else if (this.activePassword.getSeq() < password.getSeq()) {
      this.activePassword.inactivatePassword();
      this.activePassword = password;
    }

    //If older password, inactivate it
    else {
      password.inactivatePassword();
    }

    this.passwordHistory.set(password.getSeq(), password);
  }

  getPasswordHistory(): Map<number, Password> {
    return this.passwordHistory;
  }

  getActivePassword(): Password {
    if (!this.activePassword) {
      throw new Error('No active password found');
    }
    return this.activePassword;
  }
}

export class Password {
  private seq: PasswordAttributes['passwordSeq'];
  private hashedPassword: PasswordAttributes['password'];
  private active: PasswordAttributes['active'];

  constructor(
    seq: PasswordAttributes['passwordSeq'],
    hashedPassword: PasswordAttributes['password']
  ) {
    this.seq = seq;
    this.hashedPassword = hashedPassword;
    this.active = true;
  }

  getSeq(): PasswordAttributes['passwordSeq'] {
    return this.seq;
  }
  getHashedPassword(): PasswordAttributes['password'] {
    return this.hashedPassword;
  }
  getActive(): PasswordAttributes['active'] {
    return this.active;
  }

  inactivatePassword(): void {
    if (!this.active) {
      throw new Error('Password is already inactive');
    }
    this.active = false;
  }

  toString(): string {
    return `Password{seq=${this.seq}, hashedPassword=${this.hashedPassword}, active=${this.active}}`;
  }
}
