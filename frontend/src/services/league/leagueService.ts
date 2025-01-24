import { AxiosResponse } from "axios";
import api from "../apiContainer";
import { CreateLeagueRequestBody, CreateLeagueResponse, GetLeaguesForProfileResponse } from "../../../generated-api";
import { ApiRequestParams } from "../../hooks/useApi";



export interface GetLeaguesForProfileRequestParams {
  profileId: string
}

export interface CreateLeagueRequestParams {

}

const leagueService = {
  createLeague,
  getLeaguesForProfile
}

async function createLeague(
  requestData: ApiRequestParams<CreateLeagueRequestBody, void>
): Promise<AxiosResponse<CreateLeagueResponse>>  {
  const response: AxiosResponse<CreateLeagueResponse> = await api.leagueService.createLeague(requestData.body, { withCredentials: true })
  return response;
}

async function getLeaguesForProfile(
  requestData: ApiRequestParams<void, GetLeaguesForProfileRequestParams>
): Promise<AxiosResponse<GetLeaguesForProfileResponse>> {
  const response = await api.leagueService.getLeaguesForProfile(requestData.queryParams.profileId, { withCredentials: true });
  return response;

}

  // inviteLeagueMember: async (body: ProfileInviteBody, profileId: string): Promise<InviteMemberResponse> => {
  //   const response = await api.league.inviteToLeague(body, profileId, { withCredentials: true });
  //   return response.data;
  // }


export default leagueService;