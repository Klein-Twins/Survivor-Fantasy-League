import { AxiosResponse } from "axios";
import {
  CreateLeagueRequest,
  CreateLeagueResponse,
  GetLeaguesForProfileResponse,
} from "../../../generated-api";
import api from "../apiContainer";

const leagueService = {
  createLeague: async (
    name: string,
    seasonId: number,
    profileId: string
  ): Promise<CreateLeagueResponse> => {
    const apiRequest: CreateLeagueRequest = {
      name,
      seasonId: Number(seasonId),
      profileId,
    };

    const response: AxiosResponse<CreateLeagueResponse> = await api.league.createLeague(
      apiRequest,
      { withCredentials: true }
    );

    return response.data;
  },

  getLeaguesForProfile: async (
    profileId: string
  ): Promise<AxiosResponse<GetLeaguesForProfileResponse>> => {
    return await api.league.getLeaguesForProfile(profileId, {
      withCredentials: true,
    });
  },
};

export default leagueService;