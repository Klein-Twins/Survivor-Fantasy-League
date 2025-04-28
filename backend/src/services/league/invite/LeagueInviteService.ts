import { UUID } from 'crypto';
import { LeagueInvite } from '../../../domain/league/invite/LeagueInvite';
import { ProfileAttributes } from '../../../models/account/Profile';
import { SeasonsAttributes } from '../../../models/season/Seasons';
import { AccountRepository } from '../../../repositories/account/AccountRepository';
import { LeagueInviteRepository } from '../../../repositories/league/invite/LeagueInviteRepository';
import { AccountService } from '../../account/AccountService';
import { LeagueService } from '../LeagueService';
import { LeagueMember } from '../../../domain/league/LeagueMember';
import { LeagueMemberService } from '../LeagueMemberService';

export class LeagueInviteService {
  static async getLeagueInvites({
    profileId,
    seasonId,
  }: {
    profileId: ProfileAttributes['profileId'];
    seasonId: SeasonsAttributes['seasonId'];
  }): Promise<LeagueInvite[]> {
    const account = await AccountRepository.getAccountByField(
      'profileId',
      profileId
    );

    const leagueInvitesData = await LeagueInviteRepository.getLeagueInvites(
      seasonId,
      account
    );

    const leagueInvites = new Map<UUID, LeagueInvite>();

    for (const leagueInviteData of leagueInvitesData) {
      const league = await LeagueService.fetchLeague(leagueInviteData.leagueId);
      const invitedAccount = account;
      const inviterLeagueMember: LeagueMember =
        league.getLeagueMemberByProfileId(leagueInviteData.inviterProfileId);

      const leagueInvite = leagueInvites.get(leagueInviteData.leagueId);
      if (!leagueInvite) {
        leagueInvites.set(
          leagueInviteData.leagueId,
          new LeagueInvite(league, leagueInviteData.id, invitedAccount, [
            inviterLeagueMember,
          ])
        );
      } else {
        leagueInvite.addInviter(inviterLeagueMember);
      }
    }

    return Array.from(leagueInvites.values());
  }
}
