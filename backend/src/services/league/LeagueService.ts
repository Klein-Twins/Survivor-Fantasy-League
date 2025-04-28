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

@injectable()
export class LeagueService {
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
