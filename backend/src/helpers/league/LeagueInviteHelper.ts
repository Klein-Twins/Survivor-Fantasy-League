import { inject, injectable } from 'tsyringe';
import { ProfileAttributes } from '../../models/account/Profile';
import { LeagueAttributes } from '../../models/league/League';
import { LeagueInviteRepository } from '../../repositories/league/invite/LeagueInviteRepository';

@injectable()
export class LeagueInviteHelper {
  constructor(
    @inject(LeagueInviteRepository)
    private leagueInviteRepository: LeagueInviteRepository
  ) {}

  async isProfileInvitedToLeague(
    profileId: ProfileAttributes['profileId'],
    leagueId: LeagueAttributes['leagueId']
  ) {
    const leagueInvite =
      await this.leagueInviteRepository.getPendingLeagueInviteForProfileId(
        profileId,
        leagueId
      );

    return !!leagueInvite;
  }

  async isProfileInvitedToLeagueByInviter(
    profileId: ProfileAttributes['profileId'],
    leagueId: LeagueAttributes['leagueId'],
    inviterProfileId: ProfileAttributes['profileId']
  ) {
    const leagueInvite =
      await this.leagueInviteRepository.getLeagueInviteByProfileIdAndLeagueId(
        profileId,
        leagueId,
        inviterProfileId
      );

    return !!leagueInvite;
  }
}
