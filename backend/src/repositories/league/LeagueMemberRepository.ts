import { Transaction } from 'sequelize';
import { LeagueProfileAttributes } from '../../models/league/LeagueProfile';
import { models } from '../../config/db';

export class LeagueMemberRepository {
  static async saveLeagueMemberAttributes(
    attributes: LeagueProfileAttributes,
    transaction: Transaction
  ) {
    await models.LeagueProfile.upsert(attributes, { transaction });
  }
}
