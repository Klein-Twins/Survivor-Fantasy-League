import { BadRequestError } from '../../../utils/errors/errors';
import validator from 'validator';
import { GetLeagueInvitesRequestParams } from './leagueInviteController';
import { UUID } from 'crypto';
import {
  CreateAndSendLeagueInviteRequestBody,
  InviteResponse,
} from '../../../generated-api';

const leagueInviteControllerHelper = {
  validateGetLeagueInvites,
  validateSendLeagueInvite,
  validateRespondToLeagueInvite,
};

function validateRespondToLeagueInvite({
  leagueId,
  invitedProfileId,
  inviteResponse,
}: {
  leagueId: string;
  invitedProfileId: string;
  inviteResponse: string;
}): {
  leagueId: UUID;
  invitedProfileId: UUID;
  inviteResponse: InviteResponse;
} {
  if (!leagueId) {
    throw new BadRequestError('League ID is required');
  }
  if (!invitedProfileId) {
    throw new BadRequestError('Invited profile ID is required');
  }
  if (!inviteResponse) {
    throw new BadRequestError('Invite response is required');
  }

  if (!validator.isUUID(leagueId)) {
    throw new BadRequestError('League ID is not a valid UUID');
  }

  if (!validator.isUUID(invitedProfileId)) {
    throw new BadRequestError('Invited profile ID is not a valid UUID');
  }

  if (
    !Object.values(InviteResponse).includes(inviteResponse as InviteResponse)
  ) {
    throw new BadRequestError('Invite response is not valid');
  }

  return {
    leagueId: leagueId as UUID,
    invitedProfileId: invitedProfileId as UUID,
    inviteResponse: inviteResponse as InviteResponse,
  };
}
function validateSendLeagueInvite({
  inviterProfileId,
  invitedProfileId,
  leagueId,
}: {
  inviterProfileId: string;
  invitedProfileId: string;
  leagueId: string;
}): {
  inviterProfileId: UUID;
  invitedProfileId: UUID;
  leagueId: UUID;
} {
  if (!inviterProfileId) {
    throw new BadRequestError('Inviter profile ID is required');
  }
  if (!invitedProfileId) {
    throw new BadRequestError('Invited profile ID is required');
  }
  if (!leagueId) {
    throw new BadRequestError('League ID is required');
  }

  if (!validator.isUUID(inviterProfileId)) {
    throw new BadRequestError('Inviter profile ID is not a valid UUID');
  }

  if (!validator.isUUID(invitedProfileId)) {
    throw new BadRequestError('Invited profile ID is not a valid UUID');
  }

  if (!validator.isUUID(leagueId)) {
    throw new BadRequestError('League ID is not a valid UUID');
  }

  return {
    inviterProfileId: inviterProfileId as UUID,
    invitedProfileId: invitedProfileId as UUID,
    leagueId: leagueId as UUID,
  };
}

function validateGetLeagueInvites({
  profileId,
  seasonId,
}: {
  profileId: string;
  seasonId: string;
}): GetLeagueInvitesRequestParams {
  if (!profileId) {
    throw new BadRequestError('Profile ID is required');
  }
  if (!seasonId) {
    throw new BadRequestError('Season ID is required');
  }

  if (!validator.isUUID(profileId)) {
    throw new BadRequestError('Profile ID is not a valid UUID');
  }

  if (!validator.isNumeric(seasonId)) {
    throw new BadRequestError('Season ID is not a valid number');
  }
  const seasonIdNumber = parseInt(seasonId, 10);
  if (isNaN(seasonIdNumber)) {
    throw new BadRequestError('Season ID is not a valid number');
  }
  if (seasonIdNumber <= 0) {
    throw new BadRequestError('Season ID must be a positive number');
  }
  return {
    profileId: profileId as UUID,
    seasonId: seasonIdNumber,
  };
}

export default leagueInviteControllerHelper;
