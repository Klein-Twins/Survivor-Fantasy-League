import { Account } from '../../domain/account/Account';
import { League } from '../../domain/league/League';
import {
  LeagueAdmin,
  LeagueMember,
  LeagueOwner,
} from '../../domain/league/LeagueMember';
import { Transaction } from 'sequelize';
import { LeagueMemberRepository } from '../../repositories/league/LeagueMemberRepository';
import { LeagueProfileAttributes } from '../../models/league/LeagueProfile';
import { NotFoundError } from '../../utils/errors/errors';
import { AccountRepository } from '../../repositories/account/AccountRepository';
import { LeagueMemberRole } from '../../generated-api';
import { inject, injectable } from 'tsyringe';
import { AccountService } from '../account/AccountService';

@injectable()
export class LeagueMemberService {
  constructor(@inject(AccountService) private accountService: AccountService) {}

  createLeagueOwner({
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

  async fetchLeagueMembers(league: League): Promise<LeagueMember[]> {
    const leagueMemberIds: LeagueProfileAttributes['id'][] =
      await LeagueMemberRepository.getLeagueMemberIdsByLeagueId(league.getId());

    const leagueMembers: LeagueMember[] = [];
    for (const leagueMemberId of leagueMemberIds) {
      const leagueMember: LeagueMember = await this.fetchLeagueMember({
        leagueMemberId,
        league,
      });
      leagueMembers.push(leagueMember);
    }

    if (
      leagueMembers.some(
        (member) => member.getRole() !== LeagueMemberRole.Owner
      )
    ) {
      throw new NotFoundError('League owner not found');
    }

    return leagueMembers;
  }

  async fetchLeagueMember({
    leagueMemberId,
    league,
  }: {
    leagueMemberId: LeagueProfileAttributes['id'];
    league: League;
  }): Promise<LeagueMember> {
    const leagueMemberData: LeagueProfileAttributes | null =
      await LeagueMemberRepository.getLeagueMemberById(leagueMemberId);

    if (!leagueMemberData) {
      throw new NotFoundError('League member not found');
    }

    const account: Account = await this.accountService.fetchAccount(
      'profileId',
      leagueMemberData.profileId
    );

    let leagueMember: LeagueMember;
    if (leagueMemberData.role === LeagueMemberRole.Owner) {
      leagueMember = new LeagueOwner({
        id: leagueMemberData.id,
        account,
        league: league,
      });
    } else if (leagueMemberData.role === LeagueMemberRole.Admin) {
      leagueMember = new LeagueAdmin({
        id: leagueMemberData.id,
        account,
        league: league,
      });
    } else {
      leagueMember = new LeagueMember({
        id: leagueMemberData.id,
        account,
        league: league,
      });
    }

    return leagueMember;
  }

  async saveLeagueMember(
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
