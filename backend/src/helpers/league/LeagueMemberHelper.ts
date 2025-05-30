import { inject, injectable } from 'tsyringe';
import { ProfileAttributes } from '../../models/account/Profile';
import { LeagueAttributes } from '../../models/league/League';
import { LeagueService } from '../../services/league/LeagueService';

@injectable()
export class LeagueMemberHelper {
  constructor(@inject(LeagueService) private leagueService: LeagueService) {}

  async isProfileInLeague(
    profileId: ProfileAttributes['profileId'],
    leagueId: LeagueAttributes['leagueId']
  ): Promise<boolean> {
    const league = await this.leagueService.fetchLeague(leagueId);
    const leagueMembers = league.getLeagueMembers();
    return leagueMembers.some(
      (member) => member.getAccount().getProfileId() === profileId
    );
  }
}
