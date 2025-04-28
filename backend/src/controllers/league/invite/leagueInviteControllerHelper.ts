import { BadRequestError } from '../../../utils/errors/errors';
import validator from 'validator';
import { GetLeagueInvitesRequestParams } from './leagueInviteController';
import { UUID } from 'crypto';
import { CreateAndSendLeagueInviteRequestBody } from '../../../generated-api';

const leagueInviteControllerHelper = {
  validateGetLeagueInvites,
  validateSendLeagueInvite,
};

function validateSendLeagueInvite({
  inviterProfileId,
  invitedProfileId,
  leagueId,
}: {
  inviterProfileId: string;
  invitedProfileId: string;
  leagueId: string;
}): CreateAndSendLeagueInviteRequestBody {
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
