import { AxiosResponse } from 'axios';
import {
  CreateLeagueRequestBody,
  CreateLeagueResponse,
  GetLeaguesResponse,
  Profile,
} from '../../../generated-api';
import { ApiRequestParams } from '../../hooks/useApi';
import api from '../apiContainer';

export interface GetLeaguesRequestParams {
  profileId: Profile['profileId'];
}

const leagueService = {
  createLeague,
  getLeagues,
};

async function createLeague(
  requestData: ApiRequestParams<CreateLeagueRequestBody, void>
): Promise<AxiosResponse<CreateLeagueResponse>> {
  const response: AxiosResponse<CreateLeagueResponse> =
    await api.leagueService.createLeague(requestData.body, {
      withCredentials: true,
    });
  return response;
}

async function getLeagues(
  requestData: ApiRequestParams<void, GetLeaguesRequestParams>
): Promise<AxiosResponse<GetLeaguesResponse>> {
  const response = await api.leagueService.getLeagues(
    requestData.queryParams.profileId,
    { withCredentials: true }
  );
  return response;
}

export default leagueService;
