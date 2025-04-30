import { PasswordAttributes } from '../../models/account/Password';

export class Passwords {
  private passwordHistory: Password[] = [];
  private activePassword: Password | null = null;

  constructor(
    passwordsAttributes: Pick<PasswordAttributes, 'password' | 'passwordSeq'>[]
  ) {
    const passwords: Password[] = [];
    for (const passwordAttributes of passwordsAttributes) {
      const password = new Password(
        passwordAttributes.passwordSeq,
        passwordAttributes.password
      );
      this.addPassword(password);
    }
  }

  addPassword(password: Password): void {
    if (this.passwordHistory.some((p) => p.getSeq() === password.getSeq())) {
      throw new Error('Found duplicate password sequence');
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

    //Add to history
    this.passwordHistory.push(password);
    this.passwordHistory.sort((a, b) => a.getSeq() - b.getSeq());
  }

  getPasswordHistory(): Password[] {
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
