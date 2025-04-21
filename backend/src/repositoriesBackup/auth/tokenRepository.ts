import { Transaction } from 'sequelize';
import { TokenAttributes, TokenType } from '../../models/account/Tokens';
import sequelize, { models } from '../../config/db';
import tokenHelper from '../../helpers/auth/tokenHelper';

const tokenRepository = {
  createToken,
  invalidateToken,
  getTokenInDB,
};

async function getTokenInDB(
  field: keyof Pick<TokenAttributes, 'userId' | 'token'>,
  value: string,
  tokenType: TokenType
) {
  const tokenAttributes: TokenAttributes | null = await models.Tokens.findOne({
    where: {
      [field]: value,
      tokenType: tokenType,
    },
  });
  return tokenAttributes;
}

async function createToken(
  token: TokenAttributes['token'],
  userId: TokenAttributes['userId'],
  tokenType: TokenAttributes['tokenType'],
  transaction?: Transaction
): Promise<TokenAttributes> {
  let t = transaction;
  if (!t) {
    t = await sequelize.transaction();
  }

  try {
    const tokenExpDate = tokenHelper.getTokenExpirationDate(token);
    const tokenAttributes = await models.Tokens.create(
      {
        token: token,
        tokenType: tokenType,
        userId,
        isActive: true,
        tokenExpiresTime: tokenExpDate,
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

async function invalidateToken(
  token: TokenAttributes['token'],
  tokenType: TokenAttributes['tokenType'],
  transaction?: Transaction
): Promise<{ count: number; updated: TokenAttributes[] }> {
  let t = transaction;
  if (!t) {
    const t = await sequelize.transaction();
  }
  try {
    const updatedData = await models.Tokens.update(
      {
        isActive: false,
      },
      {
        where: {
          token,
          tokenType,
        },
        transaction: t,
        returning: true,
      }
    );
    if (!transaction && t) {
      await t.commit();
    }
    return {
      count: updatedData[0],
      updated: updatedData[1],
    };
  } catch (error) {
    if (!transaction && t) {
      await t.rollback();
    }
    throw error;
  }
}

export default tokenRepository;
