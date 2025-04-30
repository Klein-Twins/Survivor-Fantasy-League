import { Transaction } from 'sequelize';
import { Token } from '../../domain/account/Token';
import { models } from '../../config/db';
import { UUID } from 'crypto';
import { TokenAttributes, TokenType } from '../../models/account/Tokens';
import logger from '../../config/logger';
import { InternalServerError } from '../../utils/errors/errors';
import { injectable } from 'tsyringe';

@injectable()
export class TokenRepository {
  static async fetchTokenData(token: string): Promise<TokenAttributes | null> {
    return await models.Tokens.findOne({
      where: {
        token,
      },
    });
  }

  async fetchTokensInUserSession(
    userSessionId: TokenAttributes['userSessionId']
  ): Promise<TokenAttributes[]> {
    const tokens = await models.Tokens.findAll({
      where: {
        userSessionId,
      },
    });
    return tokens;
  }

  async saveTokenAttributes(
    attributes: TokenAttributes,
    transaction: Transaction
  ) {
    await models.Tokens.upsert(attributes, { transaction });
  }

  // static async saveToken(token: Token, transaction: Transaction) {
  //   await models.Tokens.create(
  //     {
  //       token: token.getToken(),
  //       tokenType: token.getTokenType(),
  //       userId: token.getPayload().userId,
  //       tokenExpiresTime: token.getPayload().tokenExpiresTime,
  //       isActive: true,
  //     },
  //     {
  //       transaction,
  //     }
  //   );
  // }

  // static async saveTokenForEndUserSession(
  //   token: Token,
  //   transaction: Transaction
  // ) {
  //   const activeTokenInDatabase = await models.Tokens.findOne({
  //     where: {
  //       userId: token.getPayload().userId,
  //       tokenType: token.getTokenType(),
  //       isActive: true,
  //     },
  //   });

  //   if (!activeTokenInDatabase) {
  //     logger.error(
  //       `User ${
  //         token.getPayload().userId
  //       } does not have an active token of type ${token.getTokenType()}.`
  //     );
  //     throw new InternalServerError(
  //       `User ${
  //         token.getPayload().userId
  //       } does not have an active token of type ${token.getTokenType()}.`
  //     );
  //   }

  //   if (activeTokenInDatabase.token !== token.getToken()) {
  //     logger.error(
  //       `User ${
  //         token.getPayload().userId
  //       } has a different token of type ${token.getTokenType()} stored in database.`
  //     );
  //     throw new InternalServerError(
  //       `User ${
  //         token.getPayload().userId
  //       } has a different token of type ${token.getTokenType()}.`
  //     );
  //   }

  //   await models.Tokens.update(
  //     { isActive: false },
  //     {
  //       where: {
  //         userId: token.getPayload().userId,
  //         tokenType: token.getTokenType(),
  //       },
  //       transaction,
  //     }
  //   );
  // }

  // static async saveTokenForStartUserSession(
  //   token: Token,
  //   transaction: Transaction
  // ) {
  //   const currentActiveToken = await models.Tokens.findOne({
  //     where: {
  //       userId: token.getPayload().userId,
  //       tokenType: token.getTokenType(),
  //       isActive: true,
  //     },
  //     transaction,
  //   });

  //   if (currentActiveToken) {
  //     throw new InternalServerError(
  //       `User ${
  //         token.getPayload().userId
  //       } already has an active token of type ${token.getTokenType()}.`
  //     );
  //   }

  //   await models.Tokens.create(
  //     {
  //       token: token.getToken(),
  //       tokenType: token.getTokenType(),
  //       userId: token.getPayload().userId,
  //       tokenExpiresTime: token.getTokenExpirationTime(),
  //       isActive: true,
  //     },
  //     {
  //       transaction,
  //     }
  //   );
  // }
}
