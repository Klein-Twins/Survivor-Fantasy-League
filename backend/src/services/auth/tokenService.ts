import jwt from 'jsonwebtoken';
import { Account } from '../../generated-api';
import tokenHelper from '../../helpers/auth/tokenHelper';
import { TokenType, UserJwtPayload } from '../../types/auth/tokenTypes';
import tokenRepository from '../../repositories/auth/tokenRepository';
import { Transaction } from 'sequelize';
import { models, sequelize } from '../../config/db';
import { TokenAttributes } from '../../models/account/Tokens';
import logger from '../../config/logger';
import accountService from './accountService';
import { InternalServerError } from '../../utils/errors/errors';

const tokenService = {
  createTokens,
  createToken,
  setTokensToInactive,
  decodeToken,
  getActiveTokens,
  verifyToken,
  authenticateToken,
  createNewAccessTokenFromRefreshToken,
};

function verifyToken(token: string, tokenType: TokenType): boolean {
  const tokenSecret = tokenHelper.getTokenSecret(tokenType);
  try {
    jwt.verify(token, tokenSecret);
    return true;
  } catch (error) {
    return false;
  }
}

async function getActiveTokens(userId: string): Promise<{
  dbAccessToken: TokenAttributes | null;
  dbRefreshToken: TokenAttributes | null;
}> {
  const dbAccessToken = await getActiveToken(userId, 'access');
  const dbRefreshToken = await getActiveToken(userId, 'refresh');
  return { dbAccessToken, dbRefreshToken };
}

async function getActiveToken(
  userId: string,
  tokenType: TokenType
): Promise<TokenAttributes | null> {
  const tokenAttributes: TokenAttributes | null = await models.Tokens.findOne({
    where: {
      userId: userId,
      tokenType: tokenType,
      isActive: true,
    },
  });
  return tokenAttributes;
}

async function setTokensToInactive(
  accessToken: string,
  refreshToken: string
): Promise<void> {
  const accessTokenDecoded = jwt.decode(accessToken) as UserJwtPayload;
  const refreshTokenDecoded = jwt.decode(refreshToken) as UserJwtPayload;

  const transaction: Transaction = await sequelize.transaction();
  try {
    await setTokenToInactive(
      accessToken,
      'access',
      accessTokenDecoded.userId,
      transaction
    );
    await setTokenToInactive(
      refreshToken,
      'refresh',
      refreshTokenDecoded.userId,
      transaction
    );
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function decodeToken(token: string): Promise<UserJwtPayload> {
  return jwt.decode(token) as UserJwtPayload;
}

async function setTokenToInactive(
  token: string,
  tokenType: TokenType,
  userId: string,
  transaction?: Transaction
): Promise<void> {
  await tokenRepository.setTokenToInactive(
    token,
    tokenType,
    userId,
    transaction
  );
}

async function createTokens(
  account: Account
): Promise<{ refreshToken: string; accessToken: string }> {
  const accessTokenData = await createToken(account, 'access');
  const refreshTokenData = await createToken(account, 'refresh');

  const transaction: Transaction = await sequelize.transaction();
  try {
    await tokenRepository.createTokenRecord(
      accessTokenData.token,
      'access',
      account.userId,
      getTokenExpirationDate(accessTokenData.token),
      transaction
    );
    await tokenRepository.createTokenRecord(
      refreshTokenData.token,
      'refresh',
      account.userId,
      getTokenExpirationDate(refreshTokenData.token),
      transaction
    );
  } catch (error) {
    await transaction.rollback();
    throw error;
  }

  return {
    refreshToken: refreshTokenData.token,
    accessToken: accessTokenData.token,
  };
}

function createToken(
  account: Account,
  tokenType: TokenType
): { tokenExpiresIn: string; token: string } {
  const payload: UserJwtPayload = {
    userId: account.userId,
    profileId: account.profileId,
  };
  const tokenSecret = tokenHelper.getTokenSecret(tokenType);
  const tokenExpiresIn = tokenHelper.getTokenTotalLifeSpan(tokenType);
  const token: string = jwt.sign(payload, tokenSecret, {
    expiresIn: tokenExpiresIn,
  } as jwt.SignOptions);
  return {
    tokenExpiresIn: '2h',
    token,
  };
}

function getTokenExpirationDate(token: string): Date {
  const decodedToken = jwt.decode(token) as UserJwtPayload;
  if (!decodedToken || typeof decodedToken === 'string' || !decodedToken.exp) {
    throw new Error('Invalid token');
  }
  return new Date(decodedToken.exp * 1000);
}

async function authenticateToken(
  token: string,
  tokenType: TokenType
): Promise<boolean> {
  const tokenDecoded: UserJwtPayload = await decodeToken(token);
  if (!tokenDecoded) {
    logger.error(`${tokenType} token is not a valid JWT token`);
    return false;
  }

  if (!verifyToken(token, tokenType)) {
    return false;
  }

  const isTokenInDatabase = await tokenRepository.verifyToken(
    token,
    tokenDecoded.userId,
    'refresh'
  );
  if (!isTokenInDatabase) {
    return false;
  }

  return true;
}

async function createNewAccessTokenFromRefreshToken(
  refreshToken: string
): Promise<string> {
  const decodedRefreshToken = jwt.decode(refreshToken) as UserJwtPayload;
  if (!decodedRefreshToken) {
    logger.error('Error decoding refresh token');
    throw new InternalServerError('Error decoding refresh token');
  }
  const account: Account = await accountService.getAccount(
    decodedRefreshToken.userId,
    'userId'
  );

  const newAccessToken = tokenService.createToken(account, 'access');
  return newAccessToken.token;
}
export default tokenService;
