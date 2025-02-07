import { LeagueMember, Profile } from '../../generated-api';
import { ProfileAttributes } from '../../models/account/Profile';
import { LeagueAttributes } from '../../models/league/League';
import { LeagueProfileAttributes } from '../../models/league/LeagueProfile';
import profileService from '../../services/auth/profileService';
import leagueMemberService from '../../services/league/leagueMemberService';
import { ForbiddenError } from '../../utils/errors/errors';

const leagueMemberHelper = {
  validateProfileIsInLeague,
  buildLeagueMember,
};

async function validateProfileIsInLeague(
  leagueId: LeagueAttributes['leagueId'],
  profileId: ProfileAttributes['profileId']
) {
  if (!(await leagueMemberService.isProfileInLeague(leagueId, profileId))) {
    throw new ForbiddenError('Profile is not in league');
  }
}

async function buildLeagueMember(
  leagueProfile: LeagueProfileAttributes
): Promise<LeagueMember> {
  const profileId = leagueProfile.profileId;
  const profile: Profile = await profileService.getProfile(
    profileId,
    'profileId'
  );
  return {
    role: leagueProfile.role,
    profile,
  };
}

export default leagueMemberHelper;
