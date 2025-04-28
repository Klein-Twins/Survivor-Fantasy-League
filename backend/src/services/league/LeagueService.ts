import { injectable } from 'tsyringe';
import { Account } from '../../domain/account/Account';
import { League } from '../../domain/league/League';
import { ProfileAttributes } from '../../models/account/Profile';
import { LeagueAttributes } from '../../models/league/League';
import { SeasonsAttributes } from '../../models/season/Seasons';
import { AccountRepository } from '../../repositories/account/AccountRepository';
import { AccountService } from '../account/AccountService';
import { LeagueMemberService } from './LeagueMemberService';
import sequelize from '../../config/db';
import { LeagueRepository } from '../../repositories/league/LeagueRepository';
import { NotFoundError } from '../../utils/errors/errors';
import { LeagueMember, LeagueOwner } from '../../domain/league/LeagueMember';
import { LeagueMemberRole } from '../../generated-api';

@injectable()
export class LeagueService {
  static async fetchLeagues({
    profileId,
    seasonId,
  }: {
    profileId: ProfileAttributes['profileId'];
    seasonId: SeasonsAttributes['seasonId'];
  }): Promise<League[]> {
    const account: Account = await AccountRepository.getAccountByField(
      'profileId',
      profileId
    );

    const leagueIds: League['id'][] =
      await LeagueRepository.getLeagueIdsProfileIdIsEnrolledIn(
        profileId,
        seasonId
      );

    const leagues: League[] = [];
    for (const leagueId of leagueIds) {
      const league: League = await this.fetchLeague(leagueId);
      if (league.getSeasonId() === seasonId) {
        leagues.push(league);
      }
    }

    return leagues;
  }

  static async fetchLeague(
    leagueId: LeagueAttributes['leagueId']
  ): Promise<League> {
    const leagueData: LeagueAttributes | null =
      await LeagueRepository.getLeagueById(leagueId);
    if (!leagueData) {
      throw new NotFoundError('League not found');
    }

    const league: League = new League({
      id: leagueData.leagueId,
      seasonId: leagueData.seasonId,
      name: leagueData.name,
    });

    const leagueMembers: LeagueMember[] =
      await LeagueMemberService.fetchLeagueMembers(league);

    for (const leagueMember of leagueMembers) {
      if (leagueMember.getRole() === LeagueMemberRole.Owner) {
        league.addLeagueOwner(leagueMember as LeagueOwner);
      } else {
        league.addLeagueMember(leagueMember);
      }
    }

    return league;
  }

  static async createLeague({
    profileId,
    seasonId,
    name,
  }: {
    profileId: ProfileAttributes['profileId'];
    seasonId: SeasonsAttributes['seasonId'];
    name: LeagueAttributes['name'];
  }): Promise<League> {
    const league = new League({
      seasonId,
      name,
    });

    const account: Account = await AccountRepository.getAccountByField(
      'profileId',
      profileId
    );

    const leagueOwner = LeagueMemberService.createLeagueOwner({
      account,
      league,
    });

    league.addLeagueOwner(leagueOwner);

    await LeagueService.saveLeague(league);

    return league;
  }

  static async saveLeague(league: League): Promise<void> {
    const transaction = await sequelize.transaction();

    try {
      await LeagueRepository.saveLeagueAttributes(
        {
          leagueId: league.getId(),
          seasonId: league.getSeasonId(),
          name: league.getName(),
        },
        transaction
      );

      for (const leagueMember of league.getLeagueMembers()) {
        await LeagueMemberService.saveLeagueMember(leagueMember, transaction);
      }
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
