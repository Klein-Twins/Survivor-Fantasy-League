import { models } from '../../../config/db';
import { Account } from '../../../domain/account/Account';
import { League } from '../../../domain/league/League';
import {
  InviteStatus,
  LeagueInviteAttributes,
} from '../../../models/league/LeagueInvites';
import { SeasonsAttributes } from '../../../models/season/Seasons';

export class LeagueInviteRepository {
  static async getPendingLeagueInvitesForLeague(league: League) {
    const leagueId = league.getId();

    return await models.LeagueInvites.findAll({
      where: {
        leagueId: leagueId,
        status: InviteStatus.Pending,
      },
    });
  }

  static async getPendingLeagueInvites(
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
