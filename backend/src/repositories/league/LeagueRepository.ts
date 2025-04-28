import { Transaction } from 'sequelize';
import { models } from '../../config/db';
import { LeagueAttributes } from '../../models/league/League';

export class LeagueRepository {
  static async saveLeagueAttributes(
    attributes: LeagueAttributes,
    transaction: Transaction
  ): Promise<void> {
    await models.League.upsert(attributes, { transaction });
  }
}
