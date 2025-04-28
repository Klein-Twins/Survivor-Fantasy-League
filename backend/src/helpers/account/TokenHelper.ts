import {
  JWT_ACCESS_EXPIRATION,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_EXPIRATION,
  JWT_REFRESH_SECRET,
} from '../../config/config';
import { TokenType } from '../../models/account/Tokens';
import jwt from 'jsonwebtoken';
import { UserJwtPayload } from '../../types/auth/tokenTypes';

export class TokenHelper {
  static getTokenSecret(tokenType: TokenType): string {
    if (tokenType == 'access') {
      return JWT_ACCESS_SECRET;
    } else {
      return JWT_REFRESH_SECRET;
    }
  }

  static getTokenTotalLifeSpan(tokenType: TokenType): string {
    if (tokenType == 'access') {
      return JWT_ACCESS_EXPIRATION;
    } else {
      return JWT_REFRESH_EXPIRATION;
    }
  }

  static signToken(tokenPayload: UserJwtPayload, tokenType: TokenType): string {
    const token = jwt.sign(
      tokenPayload,
      TokenHelper.getTokenSecret(tokenType),
      {
        expiresIn: TokenHelper.getTokenTotalLifeSpan(tokenType),
      } as jwt.SignOptions
    );

    return token;
  }

  static getTokenExpirationTime(token: string): Date {
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

  static decodeToken(token: string): UserJwtPayload {
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
}
