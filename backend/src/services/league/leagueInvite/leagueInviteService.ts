import {
  InviteResponse,
  League,
  LeagueInvite,
  LeagueMember,
  Profile,
} from '../../../generated-api';
import profileHelper from '../../../helpers/auth/profileHelper';
import { ProfileAttributes } from '../../../models/account/Profile';
import { LeagueAttributes } from '../../../models/league/League';
import {
  InviteStatus,
  LeagueProfileAttributes,
} from '../../../models/league/LeagueProfile';
import leagueInviteRepository from '../../../repositories/league/leagueInviteRepository';
import leagueMemberRepository from '../../../repositories/league/leagueMemberRepository';
import { ConflictError, ForbiddenError } from '../../../utils/errors/errors';
import profileService from '../../account/profileService';
import leagueMemberService from '../leagueMemberService';
import leagueService from '../leagueService';

const leagueInviteService = {
  getLeagueInvitesForProfileId,
  createAndSendLeagueInvite,
  respondToLeagueInvite,
};

async function respondToLeagueInvite({
  leagueId,
  profileId,
  inviteResponse,
}: {
  leagueId: LeagueAttributes['leagueId'];
  profileId: ProfileAttributes['profileId'];
  inviteResponse: InviteResponse;
}): Promise<League> {
  const league = await leagueService.getLeague(leagueId);

  const profile = await profileService.getProfile('profileId', profileId);

  let invitedLeagueProfileId: LeagueProfileAttributes['id'] | null = null;
  //Validate profile is not already joined league
  const leagueMember = league.leagueMembers.find((leagueMember) => {
    if (leagueMember.profile.profileId === profileId) {
      invitedLeagueProfileId = leagueMember.leagueProfileId;
      return true;
    }
    return false;
  });

  if (!leagueMember || !invitedLeagueProfileId) {
    throw new ForbiddenError('Profile has not been invited to league');
  }

  if (leagueMember.hasJoined) {
    throw new ConflictError('Profile has already joined league');
  }

  switch (inviteResponse) {
    case InviteResponse.Accept:
      await leagueInviteRepository.acceptLeagueInvite(invitedLeagueProfileId);
      return await leagueService.getLeague(leagueId);
    case InviteResponse.Decline:
      await leagueInviteRepository.declineLeagueInvite(invitedLeagueProfileId);
      return await leagueService.getLeague(leagueId);
    default:
      throw new ForbiddenError('Invalid invite response');
  }
}

async function getLeagueInvitesForProfileId(
  profileId: ProfileAttributes['profileId']
): Promise<LeagueInvite[]> {
  const leagueProfilesAttributes: LeagueProfileAttributes[] =
    await leagueMemberRepository.getLeagueProfiles('profileId', profileId);

  const invitedLeagueProfilesAttributes = leagueProfilesAttributes.filter(
    (leagueProfile) => {
      return leagueProfile.inviteStatus === InviteStatus.Pending;
    }
  );

  const leagueInvites: LeagueInvite[] = [];

  for (const invitedLeagueProfile of invitedLeagueProfilesAttributes) {
    if (!invitedLeagueProfile.inviterProfileId) {
      throw new Error('Owner of league cannot be invited');
    }
    const league = await leagueService.getLeague(invitedLeagueProfile.leagueId);
    const inviterProfile = await profileService.getProfile(
      'profileId',
      invitedLeagueProfile.inviterProfileId
    );
    const leagueInvite = buildLeagueInvite(
      invitedLeagueProfile,
      league,
      inviterProfile
    );
    leagueInvites.push(leagueInvite);
  }

  return leagueInvites;
}

async function createAndSendLeagueInvite({
  leagueId,
  invitedProfileId,
  inviterProfileId,
}: {
  leagueId: LeagueAttributes['leagueId'];
  invitedProfileId: ProfileAttributes['profileId'];
  inviterProfileId: ProfileAttributes['profileId'];
}): Promise<LeagueMember> {
  const league = await leagueService.getLeague(leagueId);

  //Validate profiles exist
  const invitedProfile = await profileService.getProfile(
    'profileId',
    invitedProfileId
  );
  const inviterProfile = await profileService.getProfile(
    'profileId',
    inviterProfileId
  );

  //Check inviter profile is in league
  const isInviterProfileInLeague = league.leagueMembers.find((leagueMember) => {
    return (
      leagueMember.profile.profileId === inviterProfileId &&
      leagueMember.hasJoined
    );
  });
  if (!isInviterProfileInLeague) {
    throw new ForbiddenError('Inviter profile is not in league');
  }

  //Check invited profile is not already in league
  const isInvitedProfileAlreadyInLeague = league.leagueMembers.find(
    (leagueMember) => {
      return (
        leagueMember.profile.profileId === invitedProfileId &&
        leagueMember.hasJoined
      );
    }
  );
  if (isInvitedProfileAlreadyInLeague) {
    throw new ConflictError('Invited profile is already in league');
  }

  //Check invited profile is invitedToLeague
  const isInvitedProfileInvitedToLeague = league.leagueMembers.find(
    (leagueMember) => {
      return (
        leagueMember.profile.profileId === invitedProfileId &&
        !leagueMember.hasJoined
      );
    }
  );
  if (!isInvitedProfileInvitedToLeague) {
    throw new ForbiddenError('Invited profile is already invited to league');
  }

  const invitedLeagueProfile: LeagueProfileAttributes =
    await leagueInviteRepository.createLeagueInvite(
      leagueId,
      inviterProfileId,
      invitedProfileId
    );

  return leagueMemberService.getInvitedOrEnrolledLeagueMember(
    leagueId,
    invitedProfileId
  );
}

function buildLeagueInvite(
  leagueProfileAttributes: LeagueProfileAttributes,
  league: League,
  inviterProfile: Profile
): LeagueInvite {
  return {
    league,
    message: `You have been invited to join a league by ${profileHelper.getProfileNameForMessage(
      inviterProfile
    )}.`,
    inviterProfile,
    inviteId: leagueProfileAttributes.id,
  };
}

export default leagueInviteService;
