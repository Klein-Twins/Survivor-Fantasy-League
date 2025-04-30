import { UUID } from 'crypto';
import { LeagueInvite } from '../../../domain/league/invite/LeagueInvite';
import { ProfileAttributes } from '../../../models/account/Profile';
import { SeasonsAttributes } from '../../../models/season/Seasons';
import { LeagueInviteRepository } from '../../../repositories/league/invite/LeagueInviteRepository';
import { LeagueService } from '../LeagueService';
import { LeagueMember } from '../../../domain/league/LeagueMember';
import { League } from '../../../domain/league/League';
import { inject, injectable } from 'tsyringe';
import { AccountService } from '../../account/AccountService';
import { NotImplementedError } from '../../../utils/errors/errors';

@injectable()
export class LeagueInviteService {
  constructor(
    @inject(AccountService) private accountService: AccountService,
    @inject(LeagueService) private leagueService: LeagueService
  ) {}

  async fetchLeagueInvitesForLeague(
    league: League
  ): Promise<Map<UUID, LeagueInvite>> {
    const pendingLeagueInvitesData =
      await LeagueInviteRepository.getPendingLeagueInvitesForLeague(league);

    const leagueInvites = new Map<UUID, LeagueInvite>();

    for (const pendingLeagueInviteData of pendingLeagueInvitesData) {
      const invitedAccount = await this.accountService.fetchAccount(
        'profileId',
        pendingLeagueInviteData.invitedProfileId
      );
      const inviterLeagueMember = league.getLeagueMemberByProfileId(
        pendingLeagueInviteData.inviterProfileId
      );

      const leagueInvite = leagueInvites.get(pendingLeagueInviteData.leagueId);
      if (!leagueInvite) {
        leagueInvites.set(
          pendingLeagueInviteData.leagueId,
          new LeagueInvite(league, pendingLeagueInviteData.id, invitedAccount, [
            inviterLeagueMember,
          ])
        );
      } else {
        leagueInvite.addInviter(inviterLeagueMember);
      }
    }
    return leagueInvites;
  }

  async sendLeagueInvite({
    inviterProfileId,
    invitedProfileId,
    leagueId,
  }: {
    inviterProfileId: ProfileAttributes['profileId'];
    invitedProfileId: ProfileAttributes['profileId'];
    leagueId: UUID;
  }): Promise<LeagueInvite> {
    const league = await this.leagueService.fetchLeague(leagueId);
    throw new NotImplementedError();
  }

  async getLeagueInvites({
    profileId,
    seasonId,
  }: {
    profileId: ProfileAttributes['profileId'];
    seasonId: SeasonsAttributes['seasonId'];
  }): Promise<LeagueInvite[]> {
    const account = await this.accountService.fetchAccount(
      'profileId',
      profileId
    );

    const leagueInvitesData =
      await LeagueInviteRepository.getPendingLeagueInvites(seasonId, account);

    const leagueInvites = new Map<UUID, LeagueInvite>();

    for (const leagueInviteData of leagueInvitesData) {
      const league = await this.leagueService.fetchLeague(
        leagueInviteData.leagueId
      );
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
