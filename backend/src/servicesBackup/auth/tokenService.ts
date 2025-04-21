import { Account, AccountRole } from '../../generated-api';
import { TokenAttributes, TokenType } from '../../models/account/Tokens';
import { UserJwtPayload } from '../../types/auth/tokenTypes';
import { UserAttributes } from '../../models/account/User';
import { ProfileAttributes } from '../../models/account/Profile';
import tokenHelper from '../../helpers/auth/tokenHelper';

import jwt from 'jsonwebtoken';
import { Transaction } from 'sequelize';
import tokenRepository from '../../repositoriesBackup/auth/tokenRepository';
import sequelize from '../../config/db';
import logger from '../../config/logger';
import {
  InternalServerError,
  NotImplementedError,
} from '../../utils/errors/errors';
import accountService from '../account/accountService';

interface Tokens {
  refreshToken: string;
  accessToken: string;
}

const tokenService = {
  createTokens,
  validateTokens,
  invalidateTokens,
  refreshAccessToken,
};

async function createTokens({
  userId,
  profileId,
  accountRole,
}: {
  userId: UserAttributes['userId'];
  profileId: ProfileAttributes['profileId'];
  accountRole: AccountRole;
}): Promise<Tokens> {
  const transaction: Transaction = await sequelize.transaction();
  try {
    const accessToken = await createToken(
      {
        userId,
        profileId,
        accountRole,
      },
      'access',
      transaction
    );
    const refreshToken = await createToken(
      {
        userId,
        profileId,
        accountRole,
      },
      'refresh',
      transaction
    );
    await transaction.commit();
    return { accessToken, refreshToken };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

type ValidateTokenOptions = {
  checkAccessTokenHasExpired: boolean;
  checkRefreshTokenHasExpired: boolean;
  checkAccessTokenInDBAndMarkedActive: boolean;
  checkRefreshTokenInDBAndMarkedActive: boolean;
  checkTokensBelongToUser: UserAttributes['userId'] | null;
};

/**
 * This function validates the access and refresh tokens.
 * This function will always check if the provided tokens are decodeable and if they match
 * This will also check the options provided
 *
 * @param accessToken
 * @param refreshToken
 * @returns
 */
async function validateTokens(
  tokens: {
    accessToken?: TokenAttributes['token'];
    refreshToken: TokenAttributes['token'];
  },
  options: ValidateTokenOptions
): Promise<UserJwtPayload | null> {
  //Decode tokens provided
  let decodedAccessToken: UserJwtPayload | null = null;
  if (tokens.accessToken) {
    decodedAccessToken = tokenHelper.decodeToken(
      tokens.accessToken
    ) as UserJwtPayload;

    //If access token cannot be decoded it is not valid.
    if (!decodedAccessToken) {
      return null;
    }
  }
  const decodedRefreshToken = tokenHelper.decodeToken(
    tokens.refreshToken
  ) as UserJwtPayload;
  //If refresh token cannot be decoded it is not valid.
  if (!decodedRefreshToken) {
    return null;
  }

  //If both tokens are provided
  if (decodedAccessToken && decodedRefreshToken) {
    const matchingPayloads = tokenHelper.checkPayloadsMatch(
      decodedAccessToken,
      decodedRefreshToken
    );
    if (!matchingPayloads) {
      return null;
    }
  }

  //If option checkAccessTokenHasExpired is true, check if access token has expired
  if (options.checkAccessTokenHasExpired && tokens.accessToken) {
    if (tokenHelper.hasTokenExpired(tokens.accessToken, 'access')) {
      return null;
    }
  }

  //If option checkRefreshTokenHasExpired is true, check if refresh token has expired
  if (options.checkRefreshTokenHasExpired) {
    if (tokenHelper.hasTokenExpired(tokens.refreshToken, 'refresh')) {
      return null;
    }
  }

  //If option checkAccessTokenInDBAndMarkedActive is true, check if access token is in the database
  if (options.checkAccessTokenInDBAndMarkedActive && tokens.accessToken) {
    const accessTokenAttributes = await tokenRepository.getTokenInDB(
      'token',
      tokens.accessToken,
      'access'
    );
    if (!accessTokenAttributes || !accessTokenAttributes.isActive) {
      return null;
    }
  }

  //If option checkRefreshTokenInDBAndMarkedActive is true, check if refresh token is in the database
  if (options.checkRefreshTokenInDBAndMarkedActive) {
    const refreshTokenAttributes = await tokenRepository.getTokenInDB(
      'token',
      tokens.refreshToken,
      'refresh'
    );
    if (!refreshTokenAttributes || !refreshTokenAttributes.isActive) {
      return null;
    }
  }

  //If option checkTokensBelongToUser is not null, check if tokens belong to the user
  if (options.checkTokensBelongToUser) {
    if (tokens.accessToken) {
      if (decodedAccessToken?.userId !== options.checkTokensBelongToUser) {
        return null;
      }
      const accessTokenAttributes = await tokenRepository.getTokenInDB(
        'token',
        tokens.accessToken,
        'access'
      );
      if (accessTokenAttributes?.userId !== options.checkTokensBelongToUser) {
        return null;
      }
    }

    if (decodedRefreshToken.userId !== options.checkTokensBelongToUser) {
      return null;
    }
    const refreshTokenAttributes = await tokenRepository.getTokenInDB(
      'token',
      tokens.refreshToken,
      'refresh'
    );
    if (refreshTokenAttributes?.userId !== options.checkTokensBelongToUser) {
      return null;
    }
  }

  return decodedRefreshToken;
}

async function invalidateTokens(
  accessToken: TokenAttributes['token'],
  refreshToken: TokenAttributes['token'],
  tokensAreValidated: boolean
): Promise<void> {
  const transaction: Transaction = await sequelize.transaction();
  try {
    if (tokensAreValidated) {
      const accessTokenInvalidatedDBInfo =
        await tokenRepository.invalidateToken(accessToken, 'access');
      if (accessTokenInvalidatedDBInfo.count !== 1) {
        logger.error(
          `Invalidating access token led to an unexpected change of ${accessTokenInvalidatedDBInfo.count} rows`
        );
      }
      const refreshTokenInvalidatedDBInfo =
        await tokenRepository.invalidateToken(refreshToken, 'refresh');
      if (refreshTokenInvalidatedDBInfo.count !== 1) {
        logger.error(
          `Invalidating access token led to an unexpected change of ${refreshTokenInvalidatedDBInfo.count} rows`
        );
      }
    } else {
      throw new NotImplementedError(
        'Invalidating tokens that are not validated is not implemented'
      );
    }
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function createToken(
  {
    userId,
    profileId,
    accountRole = AccountRole.User,
  }: {
    userId: UserAttributes['userId'];
    profileId: ProfileAttributes['profileId'];
    accountRole?: AccountRole;
  },
  tokenType: TokenType,
  transaction?: Transaction
): Promise<TokenAttributes['token']> {
  const payload: UserJwtPayload = {
    userId,
    profileId,
    accountRole,
  };
  const tokenSecret = tokenHelper.getTokenSecret(tokenType);
  const tokenExpiresIn = tokenHelper.getTokenTotalLifeSpan(tokenType);

  const token: string = jwt.sign(payload, tokenSecret, {
    expiresIn: tokenExpiresIn,
  } as jwt.SignOptions);

  const tokenAttributes = await tokenRepository.createToken(
    token,
    userId,
    tokenType,
    transaction
  );

  return tokenAttributes.token;
}

async function refreshAccessToken(
  refreshToken: TokenAttributes['token']
): Promise<TokenAttributes['token']> {
  const decodedRefreshToken = tokenHelper.decodeToken(refreshToken);
  if (!decodedRefreshToken) {
    throw new InternalServerError('Invalid refresh token');
  }

  const account: Account = await accountService.getAccount(
    'userId',
    decodedRefreshToken.userId
  );

  const oldAccessToken = await tokenRepository.getTokenInDB(
    'userId',
    decodedRefreshToken.userId,
    'refresh'
  );

  const transaction = await sequelize.transaction();
  try {
    if (oldAccessToken) {
      const { count } = await tokenRepository.invalidateToken(
        oldAccessToken.token,
        'access',
        transaction
      );
      if (count !== 1) {
        logger.warn(
          `Invalidating old access token led to an unexpected change of ${count} rows`
        );
      }
    }

    const newAccessToken = await createToken(
      {
        userId: decodedRefreshToken.userId,
        profileId: decodedRefreshToken.profileId,
        accountRole: account.accountRole,
      },
      'access',
      transaction
    );

    await transaction.commit();
    return newAccessToken;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export default tokenService;
