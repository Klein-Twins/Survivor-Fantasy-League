import { UUID } from 'crypto';
import { AccountRole } from '../../generated-api';
import { v4 } from 'uuid';
import { Account as AccountDTO } from '../../generated-api';
import bcrypt from 'bcrypt';
import { UserSession, UserSessions } from './UserSession';
import { Password, Passwords } from './Passwords';
import { PasswordAttributes } from '../../models/account/Password';
import { container } from 'tsyringe';
import { UserSessionService } from '../../services/account/UserSessionService';

export class Account {
  private accountId: UUID;
  private email: string;
  private accountRole: AccountRole;
  private profileId: UUID;
  private firstName: string;
  private lastName: string;
  private userName: string;
  private userSessions: UserSessions;
  private passwords: Passwords;

  constructor({
    accountId = v4() as UUID,
    email,
    accountRole = AccountRole.User,
    profileId = v4() as UUID,
    firstName,
    lastName,
    userName,
    passwordsAttributes,
  }: {
    accountId?: UUID;
    email: string;
    accountRole?: AccountRole;
    profileId?: UUID;
    firstName: string;
    lastName: string;
    userName: string;
    passwordsAttributes: Pick<PasswordAttributes, 'password' | 'passwordSeq'>[];
  }) {
    this.accountId = accountId;
    this.email = email;
    this.accountRole = accountRole;
    this.profileId = profileId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.userName = userName;
    this.passwords = new Passwords(passwordsAttributes);
    this.userSessions = new UserSessions(this);
  }

  async authenticateAccount(password: string): Promise<boolean> {
    const activePassword = this.getActivePassword();
    const isSamePassword = await bcrypt.compare(
      password,
      activePassword.getHashedPassword()
    );
    return isSamePassword;
  }

  getAccountId(): UUID {
    return this.accountId;
  }

  getEmail(): string {
    return this.email;
  }

  getAccountRole(): AccountRole {
    return this.accountRole;
  }

  getProfileId(): UUID {
    return this.profileId;
  }

  getFirstName(): string {
    return this.firstName;
  }

  getLastName(): string {
    return this.lastName;
  }

  getUserName(): string {
    return this.userName;
  }

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  getActivePassword(): Password {
    const activePassword = this.passwords.getActivePassword();
    if (!activePassword) {
      throw new Error('No active password found');
    }
    return activePassword;
  }

  getActiveUserSession(): UserSession | null {
    return this.userSessions.getCurrentUserSession();
  }

  getUserSessions(): UserSessions {
    return this.userSessions;
  }

  setActiveUserSession(userSession: UserSession) {
    this.userSessions.setActiveUserSession(userSession);
  }

  toString(): string {
    return `Account {
      accountId: ${this.accountId},
      email: ${this.email},
      accountRole: ${this.accountRole},
      profileId: ${this.profileId},
      firstName: ${this.firstName},
      lastName: ${this.lastName},
      userName: ${this.userName}
    }`;
  }

  toDTO(): AccountDTO {
    return {
      userId: this.accountId,
      email: this.email,
      accountRole: this.accountRole,
      profileId: this.profileId,
      firstName: this.firstName,
      lastName: this.lastName,
      userName: this.userName,
    };
  }
}
