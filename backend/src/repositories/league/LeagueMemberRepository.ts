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

  static async getLeagueMemberIdsByLeagueId(
    leagueId: LeagueProfileAttributes['leagueId']
  ): Promise<LeagueProfileAttributes['id'][]> {
    return await models.LeagueProfile.findAll({
      where: {
        leagueId,
      },
    }).then((leagueProfiles) =>
      leagueProfiles.map((leagueProfile) => leagueProfile.id)
    );
  }

  static async getLeagueMemberById(
    leagueMemberId: LeagueProfileAttributes['id']
  ): Promise<LeagueProfileAttributes | null> {
    return await models.LeagueProfile.findByPk(leagueMemberId);
  }
}
