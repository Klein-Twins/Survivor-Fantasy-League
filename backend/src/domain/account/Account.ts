import { UUID } from 'crypto';
import { AccountRole } from '../../generated-api';
import { v4 } from 'uuid';
import { Account as AccountDTO } from '../../generated-api';
import bcrypt from 'bcrypt';
import { PasswordRepository } from '../../repositories/account/PasswordRepository';
import { UserSession } from './UserSession';
import { TokenService } from '../../services/account/TokenService';

export class Account {
  private accountId: UUID;
  private email: string;
  private accountRole: AccountRole;
  private profileId: UUID;
  private firstName: string;
  private lastName: string;
  private userName: string;
  private currentUserSession: UserSession | null;

  constructor({
    accountId = v4() as UUID,
    email,
    accountRole = AccountRole.User,
    profileId = v4() as UUID,
    firstName,
    lastName,
    userName,
  }: {
    accountId?: UUID;
    email: string;
    accountRole?: AccountRole;
    profileId?: UUID;
    firstName: string;
    lastName: string;
    userName: string;
  }) {
    this.accountId = accountId;
    this.email = email;
    this.accountRole = accountRole;
    this.profileId = profileId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.userName = userName;
    this.currentUserSession = null;
  }

  async authenticateAccount(password: string): Promise<boolean> {
    const savedActivePassword = await PasswordRepository.getActivePassword(
      this.accountId
    );
    const isSamePassword = await bcrypt.compare(password, savedActivePassword);
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

  getCurrentUserSession(): UserSession | null {
    return this.currentUserSession;
  }

  // async createUserSession(): Promise<UserSession> {
  //   const { accessToken, refreshToken } = await TokenService.createTokens(this);
  //   this.currentUserSession = new UserSession(accessToken, refreshToken);
  //   return this.currentUserSession;
  // }

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
