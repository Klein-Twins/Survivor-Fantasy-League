import { AxiosResponse } from 'axios';
import {
  CreateLeagueRequestBody,
  CreateLeagueResponse,
  GetLeaguesResponse,
  Profile,
  Season,
} from '../../../generated-api';
import { ApiRequestParams } from '../../hooks/useApi';
import api from '../apiContainer';

export interface GetLeaguesRequestParams {
  profileId: Profile['profileId'];
  seasonId: Season['id'];
}

export interface CreateLeagueRequestParams {
  seasonId: Season['id'];
  profileId: Profile['profileId'];
}

const leagueService = {
  createLeague,
  getLeagues,
};

async function createLeague(
  requestData: ApiRequestParams<
    CreateLeagueRequestBody,
    CreateLeagueRequestParams
  >
): Promise<AxiosResponse<CreateLeagueResponse>> {
  const response: AxiosResponse<CreateLeagueResponse> =
    await api.leagueService.createLeague(
      requestData.body,
      requestData.queryParams.profileId,
      requestData.queryParams.seasonId,
      {
        withCredentials: true,
      }
    );
  return response;
}

async function getLeagues(
  requestData: ApiRequestParams<void, GetLeaguesRequestParams>
): Promise<AxiosResponse<GetLeaguesResponse>> {
  const response = await api.leagueService.getLeagues(
    requestData.queryParams.profileId,
    requestData.queryParams.seasonId,
    { withCredentials: true }
  );
  return response;
}

export default leagueService;
