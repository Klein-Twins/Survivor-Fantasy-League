import { TokenHelper } from '../../helpers/account/TokenHelper';
import { TokenType } from '../../models/account/Tokens';
import { UserJwtPayload } from '../../types/auth/tokenTypes';

export class Token {
  private tokenType: TokenType;
  private token: string;
  private payload: UserJwtPayload;
  private tokenExpirationTime: Date;
  private tokenExpired: boolean;

  constructor(
    {
      tokenType,
      payload,
      token,
    }:
      | { tokenType: TokenType; payload: UserJwtPayload; token?: never } // Case 1: Payload is provided, token is not
      | { tokenType: TokenType; payload?: never; token: string } // Case 2: Token is provided, payload is not)
  ) {
    this.tokenType = tokenType;
    //If token is provided
    if (token) {
      this.token = token;
      this.payload = TokenHelper.decodeToken(token);
      this.tokenExpirationTime = TokenHelper.getTokenExpirationTime(this.token);
      this.tokenExpired = this.tokenExpirationTime < new Date();
    } else if (payload) {
      this.payload = payload;
      this.token = TokenHelper.signToken(payload, tokenType);
      this.tokenExpirationTime = TokenHelper.getTokenExpirationTime(this.token);
      this.tokenExpired = false;
    } else {
      throw new Error('Either token or payload must be provided');
    }
  }

  getToken(): string {
    return this.token;
  }

  getTokenType(): TokenType {
    return this.tokenType;
  }

  getPayload(): UserJwtPayload {
    return this.payload;
  }

  getTokenExpirationTime(): Date {
    return this.tokenExpirationTime;
  }

  isTokenExpired(): boolean {
    return this.tokenExpired;
  }
}
