import { injectable } from 'tsyringe';
import { Account } from '../../domain/account/Account';
import { League } from '../../domain/league/League';
import { LeagueMember, LeagueOwner } from '../../domain/league/LeagueMember';
import { Transaction } from 'sequelize';
import { LeagueMemberRepository } from '../../repositories/league/LeagueMemberRepository';

export class LeagueMemberService {
  constructor() {}

  static createLeagueOwner({
    account,
    league,
  }: {
    account: Account;
    league: League;
  }): LeagueOwner {
    const leagueOwner = new LeagueOwner({
      account,
      league,
    });
    return leagueOwner;
  }

  static async saveLeagueMember(
    leagueMember: LeagueMember,
    transaction: Transaction
  ): Promise<void> {
    await LeagueMemberRepository.saveLeagueMemberAttributes(
      {
        id: leagueMember.getId(),
        profileId: leagueMember.getAccount().getProfileId(),
        leagueId: leagueMember.getLeague().getId(),
        role: leagueMember.getRole(),
      },
      transaction
    );
  }
}
