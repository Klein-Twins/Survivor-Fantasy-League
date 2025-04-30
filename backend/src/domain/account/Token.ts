import { container, inject } from 'tsyringe';
import { TokenHelper } from '../../helpers/account/TokenHelper';
import { TokenAttributes, TokenType } from '../../models/account/Tokens';
import { UserSessionAttributes } from '../../models/userSession/userSessions';
import { UserJwtPayload } from '../../types/auth/tokenTypes';

type TokenConstructorArgs = {
  tokenType: TokenType;
  userSessionId: UserSessionAttributes['id'];
  tokenEndTime: Date | null;
} & (
  | {
      tokenValue: string;
      tokenPayload?: never;
    }
  | {
      tokenValue?: never;
      tokenPayload: UserJwtPayload;
    }
);

export class Token {
  protected token: string;
  protected userSessionId: UserSessionAttributes['id'];
  protected issuedAtTime: TokenAttributes['issuedAt'];
  protected tokenExpiresTime: TokenAttributes['tokenExpiresTime'];
  protected payload: UserJwtPayload;
  protected tokenType: TokenType;
  protected tokenEndTime: Date | null;

  constructor(tokenArgs: TokenConstructorArgs) {
    if (
      (tokenArgs.tokenValue && tokenArgs.tokenPayload) ||
      (!tokenArgs.tokenValue && !tokenArgs.tokenPayload)
    ) {
      throw new Error(
        'Either tokenValue or tokenPayload must be provided, but not both'
      );
    }

    const tokenHelper = container.resolve(TokenHelper);

    //Construct token from existing token value
    if (tokenArgs.tokenValue) {
      this.token = tokenArgs.tokenValue;
      this.userSessionId = tokenArgs.userSessionId;
      this.tokenType = tokenArgs.tokenType;

      this.issuedAtTime = tokenHelper.getTokenIssuedAtTime(this.token);
      this.tokenExpiresTime = tokenHelper.getTokenExpirationTime(this.token);
      this.payload = tokenHelper.decodeToken(this.token);
      this.tokenEndTime = tokenArgs.tokenEndTime || null;
      return;
    }

    //Construct token from payload
    if (tokenArgs.tokenPayload) {
      this.userSessionId = tokenArgs.userSessionId;
      this.payload = tokenArgs.tokenPayload;
      this.tokenType = tokenArgs.tokenType;

      this.token = tokenHelper.signToken(
        tokenArgs.tokenPayload,
        tokenArgs.tokenType
      );
      this.tokenExpiresTime = tokenHelper.getTokenExpirationTime(this.token);
      this.issuedAtTime = tokenHelper.getTokenIssuedAtTime(this.token);
      this.tokenEndTime = tokenArgs.tokenEndTime || null;
      return;
    }
    throw new Error(
      'Either tokenValue or tokenPayload must be provided, but not both'
    );
  }

  getToken(): string {
    return this.token;
  }
  getUserSessionId(): UserSessionAttributes['id'] {
    return this.userSessionId;
  }

  getIssuedAtTime(): TokenAttributes['issuedAt'] {
    return this.issuedAtTime;
  }
  getTokenExpiresTime(): TokenAttributes['tokenExpiresTime'] {
    return this.tokenExpiresTime;
  }
  getPayload(): UserJwtPayload {
    return this.payload;
  }
  getTokenType(): TokenType {
    return this.tokenType;
  }
  getTokenEndTime(): Date | null {
    return this.tokenEndTime;
  }
  endToken(): void {
    this.tokenEndTime = new Date();
  }
}
