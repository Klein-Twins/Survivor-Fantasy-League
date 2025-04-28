import { models } from '../../../config/db';
import { Account } from '../../../domain/account/Account';
import { ProfileAttributes } from '../../../models/account/Profile';
import {
  InviteStatus,
  LeagueInviteAttributes,
} from '../../../models/league/LeagueInvites';
import { SeasonsAttributes } from '../../../models/season/Seasons';

export class LeagueInviteRepository {
  static async getLeagueInvites(
    seasonId: SeasonsAttributes['seasonId'],
    account: Account
  ): Promise<LeagueInviteAttributes[]> {
    return await models.LeagueInvites.findAll({
      where: {
        invitedProfileId: account.getProfileId(),
        status: InviteStatus.Pending,
      },
      include: [
        {
          model: models.League,
          as: 'league',
          required: true,
          where: {
            seasonId: seasonId,
          },
        },
      ],
    });
  }
}
