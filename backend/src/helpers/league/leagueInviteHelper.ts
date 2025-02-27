import {
  LeagueInvite,
  LeagueMemberRoleEnum,
  RespondToLeagueInviteRequestBodyInviteResponseEnum,
} from '../../generated-api';
import { ProfileAttributes } from '../../models/account/Profile';
import { LeagueAttributes } from '../../models/league/League';
import { LeagueProfileAttributes } from '../../models/league/LeagueProfile';
import leagueInviteRepository from '../../repositories/league/leagueInviteRepository';
import leagueRepository from '../../repositories/league/leagueRepository';

import profileService from '../../services/auth/profileService';
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  InternalServerError,
} from '../../utils/errors/errors';
import profileHelper from '../auth/profileHelper';
import leagueHelper from './leagueHelper';
import leagueMemberHelper from './leagueMemberHelper';

const leagueInviteHelper = {
  validateCreateAndSendLeagueInviteRequest,
  validateRespondToLeagueInviteRequest,
  isProfileInvitedToLeague,
  buildLeagueInvite,
};

async function buildLeagueInvite(
  leagueProfileAttributes: LeagueProfileAttributes
): Promise<LeagueInvite> {
  if (
    !leagueProfileAttributes.inviterProfileId ||
    leagueProfileAttributes.role === LeagueMemberRoleEnum.OWNER
  ) {
    throw new InternalServerError(
      'Cannot get leagueInvite for Owner of a league'
    );
  }

  const league = await leagueRepository.getLeague(
    leagueProfileAttributes.leagueId
  );
  const inviterProfile = await profileService.getProfile(
    leagueProfileAttributes.inviterProfileId,
    'profileId'
  );

  return {
    league,
    message: `You have been invited to join a league by ${profileHelper.getProfileNameForMessage(
      inviterProfile
    )}.`,
    inviterProfile,
    inviteId: leagueProfileAttributes.id,
  };
}

async function validateCreateAndSendLeagueInviteRequest(
  leagueId: LeagueAttributes['leagueId'],
  inviterProfileId: ProfileAttributes['profileId'],
  invitedProfileId: ProfileAttributes['profileId']
): Promise<void> {
  await leagueHelper.validateLeagueId(leagueId);
  await profileHelper.validateProfileId(inviterProfileId);
  await profileHelper.validateProfileId(invitedProfileId);

  await leagueMemberHelper.validateProfileIsInLeague(
    leagueId,
    inviterProfileId
  );
  if (await isProfileInvitedToLeague(leagueId, invitedProfileId)) {
    throw new ConflictError('Profile is already invited to league');
  }
}

async function validateRespondToLeagueInviteRequest(
  leagueId: LeagueAttributes['leagueId'],
  profileId: ProfileAttributes['profileId'],
  inviteResponse: RespondToLeagueInviteRequestBodyInviteResponseEnum
): Promise<void> {
  await leagueHelper.validateLeagueId(leagueId);
  await profileHelper.validateProfileId(profileId);
  if (!(await isProfileInvitedToLeague(leagueId, profileId))) {
    throw new ForbiddenError('Profile is not invited to league');
  }
  validateInviteResponse(inviteResponse);
}

function validateInviteResponse(
  inviteResponse: RespondToLeagueInviteRequestBodyInviteResponseEnum
): void {
  if (
    !Object.values(RespondToLeagueInviteRequestBodyInviteResponseEnum).includes(
      inviteResponse
    )
  ) {
    throw new BadRequestError('Invalid invite response');
  }
}

async function isProfileInvitedToLeague(
  leagueId: LeagueAttributes['leagueId'],
  profileId: ProfileAttributes['profileId']
): Promise<boolean> {
  const leagueInvite: LeagueInvite | null =
    await leagueInviteRepository.getLeagueInviteByProfileIdAndLeagueId(
      leagueId,
      profileId
    );
  if (!leagueInvite) {
    return false;
  }
  return true;
}

export default leagueInviteHelper;
