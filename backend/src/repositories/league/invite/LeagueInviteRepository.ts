import { injectable } from 'tsyringe';
import { models } from '../../../config/db';
import { Account } from '../../../domain/account/Account';
import { League } from '../../../domain/league/League';
import {
  InviteStatus,
  LeagueInviteAttributes,
  LEAGUEINVITES_TO_LEAGUE,
} from '../../../models/league/LeagueInvites';
import { SeasonsAttributes } from '../../../models/season/Seasons';
import { ProfileAttributes } from '../../../models/account/Profile';
import { LeagueAttributes } from '../../../models/league/League';
import { Transaction } from 'sequelize';
import { Season } from '../../../domain/season/Season';

@injectable()
export class LeagueInviteRepository {
  async getLeagueInvitesForProfileId(
    profileId: ProfileAttributes['profileId'],
    seasonId: Season['seasonId']
  ): Promise<LeagueInviteAttributes[]> {
    const leagueInvites = (await models.LeagueInvites.findAll({
      where: {
        status: InviteStatus.Pending,
        invitedProfileId: profileId,
      },
      include: [
        {
          model: models.League,
          as: LEAGUEINVITES_TO_LEAGUE,
          where: {
            seasonId: seasonId,
          },
        },
      ],
    })) as unknown as (LeagueInviteAttributes & {
      [LEAGUEINVITES_TO_LEAGUE]: LeagueAttributes;
    })[];

    return leagueInvites;
  }

  async saveLeagueInviteResponse(
    leagueInviteAttributes: LeagueInviteAttributes,
    transaction: Transaction
  ): Promise<void> {
    await models.LeagueInvites.update(
      {
        status: leagueInviteAttributes.status,
      },
      {
        where: {
          id: leagueInviteAttributes.id,
        },
        transaction: transaction,
      }
    );
  }

  async saveLeagueInvite(
    leagueInviteAttributes: LeagueInviteAttributes,
    transaction: Transaction
  ): Promise<void> {
    await models.LeagueInvites.upsert(leagueInviteAttributes, { transaction });
  }

  async getPendingLeagueInviteForProfileId(
    profileId: ProfileAttributes['profileId'],
    leagueId: LeagueAttributes['leagueId']
  ): Promise<LeagueInviteAttributes | null> {
    const leagueInvite = await models.LeagueInvites.findOne({
      where: {
        leagueId: leagueId,
        invitedProfileId: profileId,
        status: InviteStatus.Pending,
      },
    });
    return leagueInvite ? leagueInvite.get() : null;
  }

  async getLeagueInviteByProfileIdAndLeagueId(
    profileId: ProfileAttributes['profileId'],
    leagueId: LeagueAttributes['leagueId'],
    inviterProfileId: ProfileAttributes['profileId']
  ): Promise<LeagueInviteAttributes | null> {
    const leagueInvite = await models.LeagueInvites.findOne({
      where: {
        invitedProfileId: profileId,
        leagueId: leagueId,
        status: InviteStatus.Pending,
        inviterProfileId: inviterProfileId,
      },
    });
    return leagueInvite ? leagueInvite.get() : null;
  }

  async getPendingLeagueInvitesForLeague(league: League) {
    const leagueId = league.getId();

    return await models.LeagueInvites.findAll({
      where: {
        leagueId: leagueId,
        status: InviteStatus.Pending,
      },
    });
  }

  async getPendingLeagueInvites(
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
