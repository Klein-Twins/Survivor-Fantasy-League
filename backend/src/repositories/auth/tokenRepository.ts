import { Transaction } from 'sequelize';
import { TokenType } from '../../types/auth/tokenTypes';
import { models, sequelize } from '../../config/db';
import { TokenAttributes } from '../../models/account/Tokens';
import { UserAttributes } from '../../models/account/User';

const tokenRepository = {
  createTokenRecord,
  setTokenToInactive,
  verifyToken,
};

async function verifyToken(
  token: string,
  userId: UserAttributes['userId'],
  tokenType: TokenType
): Promise<boolean> {
  const tokenAttributes = await models.Tokens.findOne({
    where: {
      token: token,
      userId: userId,
      tokenType: tokenType,
      isActive: true,
    },
  });

  if (!tokenAttributes) {
    return false;
  }

  return true;
}

async function setTokenToInactive(
  token: string,
  tokenType: TokenType,
  userId: UserAttributes['userId'],
  transaction?: Transaction
): Promise<void> {
  // let t = transaction;
  // if (!transaction) {
  //   t = await sequelize.transaction();
  // }

  try {
    await models.Tokens.update(
      {
        isActive: false,
      },
      {
        where: {
          token: token,
          tokenType: tokenType,
          userId: userId,
        },
        transaction, //t,
      }
    );

    // if (updatedToken[0] !== 1) {
    //   throw new Error(
    //     'Did not update tokens - updated more or less than 1 token'
    //   );
    // }

    // if (!transaction && t) {
    //   await t.commit();
    // }

    // return updatedToken[1][0];
  } catch (error) {
    // if (!transaction && t) {
    //   await t.rollback();
    // }
    throw error;
  }
}

async function createTokenRecord(
  token: string,
  tokenType: TokenType,
  userId: UserAttributes['userId'],
  tokenExpiresTime: Date,
  transaction?: Transaction
): Promise<TokenAttributes> {
  let t = transaction;
  if (!transaction) {
    t = await sequelize.transaction();
  }

  try {
    const tokenAttributes = await models.Tokens.create(
      {
        token: token,
        tokenType: tokenType,
        userId,
        isActive: true,
        tokenExpiresTime: tokenExpiresTime,
      },
      { transaction: t }
    );

    if (!transaction && t) {
      await t.commit();
    }

    return tokenAttributes;
  } catch (error) {
    if (!transaction && t) {
      await t.rollback();
    }
    throw error;
  }
}
export default tokenRepository;
