import { Transaction } from 'sequelize';
import { ProfileAttributes } from '../../models/account/Profile';
import { LeagueAttributes } from '../../models/league/League';
import {
  InviteStatus,
  LeagueProfileAttributes,
} from '../../models/league/LeagueProfile';
import { LeagueMember, Profile } from '../../generated-api';
import leagueMemberRepository from '../../repositories/league/leagueMemberRepository';
import leagueService from './leagueService';
import {
  NotFoundError,
  NotImplementedError,
  UnauthorizedError,
} from '../../utils/errors/errors';
import profileService from '../account/profileService';

const leagueMemberService = {
  createLeagueMember,
  getLeagueMembers,
  getEnrolledLeagueMember,
  getInvitedOrEnrolledLeagueMember,
  isInLeague,
};

async function isInLeague(
  field: 'leagueProfileId' | 'profileId',
  value: LeagueProfileAttributes['id'] | ProfileAttributes['profileId'],
  leagueId: LeagueAttributes['leagueId'],
  throwsIfNotFound: boolean = false,
  throwsIfNotInLeague: boolean = false
): Promise<boolean> {
  if (field === 'leagueProfileId') {
    const foundLeagueId =
      await leagueMemberRepository.getLeagueIdByLeagueProfile(value);
    if (!foundLeagueId) {
      if (throwsIfNotFound) {
        throw new NotFoundError('League profile not found');
      }
      return false;
    }
    if (throwsIfNotInLeague && foundLeagueId !== leagueId) {
      throw new UnauthorizedError('Profile is not in league');
    }
    return foundLeagueId === leagueId;
  } else {
    throw new NotImplementedError('isInLeague not implemented for profileId');
  }
}

async function createLeagueMember({
  leagueId,
  profileId,
  inviterProfileId,
  role,
  inviteStatus,
  transaction,
}: {
  leagueId: LeagueAttributes['leagueId'];
  profileId: ProfileAttributes['profileId'];
  inviterProfileId: ProfileAttributes['profileId'];
  role: LeagueProfileAttributes['role'];
  inviteStatus: LeagueProfileAttributes['inviteStatus'];
  transaction?: Transaction;
}): Promise<LeagueMember> {
  const leagueProfileAttributes =
    await leagueMemberRepository.createLeagueMember({
      leagueId,
      profileId,
      inviterProfileId,
      role,
      inviteStatus,
      transaction,
    });

  const profile = await profileService.getProfile('profileId', profileId);

  return buildLeagueMember(leagueProfileAttributes, profile);
}

async function getLeagueMembers(leagueId: LeagueAttributes['leagueId']) {
  const leagueProfilesAttributes =
    await leagueMemberRepository.getLeagueProfiles('leagueId', leagueId);

  return await Promise.all(
    leagueProfilesAttributes.map(async (leagueProfile) => {
      const profile = await profileService.getProfile(
        'profileId',
        leagueProfile.profileId
      );
      return buildLeagueMember(leagueProfile, profile);
    })
  );
}

async function getEnrolledLeagueMember(
  leagueId: LeagueAttributes['leagueId'],
  profileId: ProfileAttributes['profileId']
): Promise<LeagueMember> {
  const leagueMember = await getInvitedOrEnrolledLeagueMember(
    'profileId',
    profileId,
    leagueId
  );
  if (!leagueMember.hasJoined) {
    throw new UnauthorizedError('Profile has not joined league');
  }
  return leagueMember;
}

async function getInvitedOrEnrolledLeagueMember(
  field: 'leagueProfileId' | 'profileId',
  value: LeagueAttributes['leagueId'] | ProfileAttributes['profileId'],
  leagueId: LeagueAttributes['leagueId']
): Promise<LeagueMember> {
  const league = await leagueService.getLeague(leagueId);

  let foundLeagueMember: LeagueMember | undefined;
  if (field === 'profileId') {
    foundLeagueMember = league.leagueMembers.find(
      (member) => member.profile.profileId === value
    );
  } else if (field === 'leagueProfileId') {
    foundLeagueMember = league.leagueMembers.find(
      (member) => member.leagueProfileId === value
    );
  } else {
    throw new NotImplementedError(
      'getInvitedOrEnrolledLeagueMember not implemented for field'
    );
  }
  if (!foundLeagueMember) {
    throw new NotFoundError('Profile is not in league');
  }

  return foundLeagueMember;
}

function buildLeagueMember(
  leagueProfile: LeagueProfileAttributes,
  profile: Profile
): LeagueMember {
  return {
    role: leagueProfile.role,
    profile,
    leagueProfileId: leagueProfile.id,
    hasJoined: leagueProfile.inviteStatus === InviteStatus.Accepted,
    totalPoints: Math.floor(Math.random() * 1000),
  };
}

export default leagueMemberService;
