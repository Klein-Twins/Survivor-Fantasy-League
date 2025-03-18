import {
  JWT_ACCESS_EXPIRATION,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_EXPIRATION,
  JWT_REFRESH_SECRET,
} from '../../config/config';
import jwt from 'jsonwebtoken';
import logger from '../../config/logger';
import { TokenType, UserJwtPayload } from '../../types/auth/tokenTypes';
import { InternalServerError } from '../../utils/errors/errors';

const tokenHelper = {
  getTokenSecret,
  getTokenTotalLifeSpan,
  getNumSecondsTokenIsValid,
  getTokenExpirationDate,
  decodeToken,
  decodeTokens,
  hasTokenExpired,
  checkPayloadsMatch,
};

function decodeTokens(tokens: { accessToken: string; refreshToken: string }):
  | {
      refreshPayload: UserJwtPayload;
      accessPayload: UserJwtPayload;
      match: false;
    }
  | {
      refreshPayload?: UserJwtPayload;
      accessPayload: UserJwtPayload;
      match: false;
    }
  | {
      refreshPayload: UserJwtPayload;
      accessPayload?: UserJwtPayload;
      match: false;
    }
  | { payload: UserJwtPayload; match: true }
  | null {
  const decodedAccessToken = decodeToken(tokens.accessToken);
  const decodedRefreshToken = decodeToken(tokens.refreshToken);

  if (decodedAccessToken && decodedRefreshToken) {
    if (checkPayloadsMatch(decodedAccessToken, decodedRefreshToken)) {
      return { payload: decodedAccessToken, match: true };
    } else {
      return {
        refreshPayload: decodedAccessToken,
        accessPayload: decodedRefreshToken,
        match: false,
      };
    }
  } else if (decodedAccessToken) {
    return { accessPayload: decodedAccessToken, match: false };
  } else if (decodedRefreshToken) {
    return { refreshPayload: decodedRefreshToken, match: false };
  } else {
    return null;
  }
}

// function validateJsonWebToken(
//   token: string,
//   tokenType: TokenType
// ): JsonWebTokenStatus {
//   const tokenSecret = tokenHelper.getTokenSecret(tokenType);
//   try {
//     const decoded = jwt.verify(token, tokenSecret) as UserJwtPayload;
//     return {
//       decoded: decoded,
//       isExpired: false,
//     };
//   } catch (error) {
//     if (error instanceof jwt.TokenExpiredError) {
//       const decoded = jwt.decode(token) as UserJwtPayload;
//       return {
//         decoded,
//         isExpired: true,
//       };
//     } else {
//       return {
//         decoded: null,
//       };
//     }
//   }
// }

/**
 * Validate a JWT token is not expired. If the token is not decodable, an error is thrown.
 * Should check to make sure a token is decodable before calling.
 *
 * @param token
 * @param tokenType
 * @returns
 */
function hasTokenExpired(token: string, tokenType: TokenType): boolean {
  const tokenSecret = getTokenSecret(tokenType);
  try {
    jwt.verify(token, tokenSecret);
    return false;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return true;
    }
    throw error;
  }
}

function checkPayloadsMatch(
  payload1: UserJwtPayload,
  payload2: UserJwtPayload
) {
  return (
    payload1.user === payload2.userId &&
    payload1.profileId === payload2.profileId &&
    payload1.accountRole === payload2.accountRole
  );
}

function decodeToken(token: string): UserJwtPayload | null {
  const decodedToken = jwt.decode(token) as UserJwtPayload;
  if (!decodedToken) {
    logger.error('Cannot decode token');
    return null;
  }
  return decodedToken;
}

function getTokenExpirationDate(token: string): Date {
  const decodedToken = jwt.decode(token) as UserJwtPayload;
  if (!decodedToken || typeof decodedToken === 'string' || !decodedToken.exp) {
    throw new Error('Invalid token');
  }
  return new Date(decodedToken.exp * 1000);
}

function getTokenSecret(tokenType: TokenType) {
  if (tokenType == 'access') {
    return JWT_ACCESS_SECRET;
  } else {
    return JWT_REFRESH_SECRET;
  }
}

function getTokenTotalLifeSpan(tokenType: TokenType): string | number {
  if (tokenType == 'access') {
    return JWT_ACCESS_EXPIRATION;
  } else {
    return JWT_REFRESH_EXPIRATION;
  }
}

function getNumSecondsTokenIsValid(token: string): number {
  const decodedToken = jwt.decode(token) as UserJwtPayload | null;
  if (!decodedToken || !decodedToken.exp) {
    logger.error(
      'Cannot decode token for calculating number of seconds the token is valid for.'
    );
    throw new InternalServerError();
  }
  return decodedToken.exp - Math.floor(Date.now() / 1000);
}

export default tokenHelper;
