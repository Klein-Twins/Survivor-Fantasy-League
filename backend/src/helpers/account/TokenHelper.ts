import {
  JWT_ACCESS_EXPIRATION,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_EXPIRATION,
  JWT_REFRESH_SECRET,
} from '../../config/config';
import { TokenType } from '../../models/account/Tokens';
import jwt from 'jsonwebtoken';
import { UserJwtPayload } from '../../types/auth/tokenTypes';
import { injectable } from 'tsyringe';

@injectable()
export class TokenHelper {
  private getTokenSecret(tokenType: TokenType): string {
    if (tokenType == 'access') {
      return JWT_ACCESS_SECRET;
    } else {
      return JWT_REFRESH_SECRET;
    }
  }

  private getTokenTotalLifeSpan(tokenType: TokenType): string {
    if (tokenType == 'access') {
      return JWT_ACCESS_EXPIRATION;
    } else {
      return JWT_REFRESH_EXPIRATION;
    }
  }

  signToken(tokenPayload: UserJwtPayload, tokenType: TokenType): string {
    const token = jwt.sign(tokenPayload, this.getTokenSecret(tokenType), {
      expiresIn: this.getTokenTotalLifeSpan(tokenType),
    } as jwt.SignOptions);

    return token;
  }

  getTokenExpirationTime(token: string): Date {
    const decodedToken = jwt.decode(token) as UserJwtPayload;
    if (
      !decodedToken ||
      typeof decodedToken === 'string' ||
      !decodedToken.exp
    ) {
      throw new Error('Invalid token');
    }
    return new Date(decodedToken.exp * 1000);
  }

  getTokenIssuedAtTime(token: string): Date {
    const decodedToken = jwt.decode(token) as UserJwtPayload;
    if (
      !decodedToken ||
      typeof decodedToken === 'string' ||
      !decodedToken.iat
    ) {
      throw new Error('Invalid token');
    }
    return new Date(decodedToken.iat * 1000);
  }

  decodeToken(token: string): UserJwtPayload {
    const decodedToken = jwt.decode(token) as UserJwtPayload;
    if (
      !decodedToken ||
      typeof decodedToken === 'string' ||
      !decodedToken.userId
    ) {
      throw new Error('Invalid token');
    }
    return decodedToken;
  }

  validateTokenPayloadsEqual(
    tokenPayload1: UserJwtPayload,
    tokenPayload2: UserJwtPayload
  ): boolean {
    return (
      tokenPayload1.userId === tokenPayload2.userId &&
      tokenPayload1.accountRole === tokenPayload2.accountRole &&
      tokenPayload1.profileId === tokenPayload2.profileId
    );
  }

  isTokenExpired(token: string, tokenType: TokenType): boolean {
    jwt.verify(token, this.getTokenSecret(tokenType), (err) => {
      if (err) {
        return true; // Token is expired
      }
    });
    return false; // Token is valid
  }
}
