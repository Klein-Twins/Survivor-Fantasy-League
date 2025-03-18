import { AxiosResponse } from 'axios';
import {
  CreateAndSendLeagueInviteRequestBody,
  CreateAndSendLeagueInviteResponse,
  GetLeagueInvitesResponse,
  Profile,
  RespondToLeagueInviteRequestBody,
  RespondToLeagueInviteResponse,
} from '../../../../generated-api';
import { ApiRequestParams } from '../../../hooks/useApi';
import api from '../../apiContainer';

export interface GetLeagueInvitesRequestParams {
  profileId: Profile['profileId'];
  seasonId: number;
}

export interface RespondToLeagueInviteRequestParams
  extends GetLeagueInvitesRequestParams {}

const leagueInviteService = {
  respondToLeagueInvite,
  getLeagueInvites,
  sendLeagueInvite,
};

async function respondToLeagueInvite(
  requestData: ApiRequestParams<
    RespondToLeagueInviteRequestBody,
    RespondToLeagueInviteRequestParams
  >
): Promise<AxiosResponse<RespondToLeagueInviteResponse>> {
  const response = await api.leagueInviteService.respondToLeagueInvite(
    requestData.body,
    requestData.queryParams.profileId,
    requestData.queryParams.seasonId,
    { withCredentials: true }
  );
  return response;
}

async function getLeagueInvites(
  requestData: ApiRequestParams<void, GetLeagueInvitesRequestParams>
): Promise<AxiosResponse<GetLeagueInvitesResponse>> {
  const response = await api.leagueInviteService.getLeagueInvitesForPlayer(
    requestData.queryParams.profileId,
    requestData.queryParams.seasonId,
    { withCredentials: true }
  );
  return response;
}

async function sendLeagueInvite(
  requestData: ApiRequestParams<CreateAndSendLeagueInviteRequestBody, void>
): Promise<AxiosResponse<CreateAndSendLeagueInviteResponse>> {
  const response = await api.leagueInviteService.createAndSendLeagueInvite(
    requestData.body,
    undefined,
    undefined,
    { withCredentials: true }
  );
  return response;
}

export default leagueInviteService;
