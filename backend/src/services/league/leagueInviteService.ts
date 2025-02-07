import { Transaction } from 'sequelize';
import {
  GetLeagueInvitesForPlayerResponseData,
  LeagueInvite,
  RespondToLeagueInviteRequestBody,
  RespondToLeagueInviteRequestBodyInviteResponseEnum,
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
): Promise<RespondToLeagueInviteResponseData | null> {
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

  if (
    inviteResponse === RespondToLeagueInviteRequestBodyInviteResponseEnum.ACCEPT
  ) {
    await leagueInviteRepository.acceptLeagueInvite(leagueInvite);
    return { league: await leagueService.getLeague(leagueId) };
  } else if (
    inviteResponse ===
    RespondToLeagueInviteRequestBodyInviteResponseEnum.DECLINE
  ) {
    await leagueInviteRepository.declineLeagueInvite(leagueInvite);
    return null;
  } else {
    throw new BadRequestError('Invalid invite response');
  }
}

async function getLeagueInvitesForProfileId(
  profileId: ProfileAttributes['profileId'],
  transaction?: Transaction
): Promise<GetLeagueInvitesForPlayerResponseData> {
  await profileHelper.validateProfileId(profileId);
  const leagueInvites: LeagueInvite[] =
    await leagueInviteRepository.getLeagueInvitesForProfileId(
      profileId,
      transaction
    );

  const responseData: GetLeagueInvitesForPlayerResponseData = {
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
