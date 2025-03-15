import { Transaction } from 'sequelize';
import {
  GetLeagueInvitesResponseData,
  InviteResponse,
  LeagueInvite,
  RespondToLeagueInviteRequestBody,
  RespondToLeagueInviteResponseData,
} from '../../generated-api';
import leagueInviteRepository from '../../repositories/league/leagueInviteRepository';
import { ProfileAttributes } from '../../models/account/Profile';
import profileHelper from '../../helpers/auth/profileHelper';
import leagueInviteHelper from '../../helpers/league/leagueInviteHelper';
import { LeagueAttributes } from '../../models/league/League';
import { BadRequestError, ForbiddenError } from '../../utils/errors/errors';
import leagueService from './leagueService';

const leagueInviteService = {
  getLeagueInvitesForProfileId,
  createAndSendLeagueInvite,
  respondToLeagueInvite,
};

async function respondToLeagueInvite(
  requestData: RespondToLeagueInviteRequestBody
): Promise<RespondToLeagueInviteResponseData> {
  const { leagueId, profileId, inviteResponse } = requestData;

  await leagueInviteHelper.validateRespondToLeagueInviteRequest(
    leagueId,
    profileId,
    inviteResponse
  );

  const leagueInvite: LeagueInvite | null =
    await leagueInviteRepository.getLeagueInviteByProfileIdAndLeagueId(
      leagueId,
      profileId
    );
  //TODO: This should not be necessary - restructure the leagueInviteRepository function
  if (!leagueInvite) {
    throw new ForbiddenError('League invite not found');
  }

  if (inviteResponse === InviteResponse.Accept) {
    await leagueInviteRepository.acceptLeagueInvite(leagueInvite);
    return {
      league: await leagueService.getLeague(leagueId),
      inviteId: leagueInvite.inviteId,
      inviteResponse,
    };
  } else if (inviteResponse === InviteResponse.Decline) {
    await leagueInviteRepository.declineLeagueInvite(leagueInvite);
    return {
      league: undefined,
      inviteId: leagueInvite.inviteId,
      inviteResponse,
    };
  } else {
    throw new BadRequestError('Invalid invite response');
  }
}

async function getLeagueInvitesForProfileId(
  profileId: ProfileAttributes['profileId'],
  transaction?: Transaction
): Promise<GetLeagueInvitesResponseData> {
  await profileHelper.validateProfileId(profileId);
  const leagueInvites: LeagueInvite[] =
    await leagueInviteRepository.getLeagueInvitesForProfileId(
      profileId,
      transaction
    );

  const responseData: GetLeagueInvitesResponseData = {
    leagueInvites,
    numLeagueInvites: leagueInvites.length,
  };
  return responseData;
}

async function createAndSendLeagueInvite(
  leagueId: LeagueAttributes['leagueId'],
  inviterProfileId: ProfileAttributes['profileId'],
  invitedProfileId: ProfileAttributes['profileId']
): Promise<void> {
  await leagueInviteHelper.validateCreateAndSendLeagueInviteRequest(
    leagueId,
    inviterProfileId,
    invitedProfileId
  );

  const leagueInvite: LeagueInvite =
    await leagueInviteRepository.createLeagueInvite(
      leagueId,
      inviterProfileId,
      invitedProfileId
    );
}

export default leagueInviteService;
