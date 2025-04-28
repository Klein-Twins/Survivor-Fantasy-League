import { Transaction } from 'sequelize';
import { models } from '../../config/db';
import { LeagueAttributes } from '../../models/league/League';
import { ProfileAttributes } from '../../models/account/Profile';
import { SeasonsAttributes } from '../../models/season/Seasons';

export class LeagueRepository {
  static async saveLeagueAttributes(
    attributes: LeagueAttributes,
    transaction: Transaction
  ): Promise<void> {
    await models.League.upsert(attributes, { transaction });
  }

  static async getLeagueById(
    leagueId: LeagueAttributes['leagueId']
  ): Promise<LeagueAttributes | null> {
    return await models.League.findByPk(leagueId);
  }

  static async getLeagueIdsProfileIdIsEnrolledIn(
    profileId: ProfileAttributes['profileId'],
    seasonId: SeasonsAttributes['seasonId']
  ): Promise<LeagueAttributes['leagueId'][]> {
    const leagueIds = await models.LeagueProfile.findAll({
      where: {
        profileId,
      },
      include: [
        {
          model: models.League,
          as: 'league',
          where: {
            seasonId: seasonId,
          },
          required: true,
        },
      ],
    }).then((leagueProfiles) =>
      leagueProfiles.map((leagueProfile) => leagueProfile.leagueId)
    );
    return leagueIds;
  }
}
