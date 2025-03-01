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
};

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
