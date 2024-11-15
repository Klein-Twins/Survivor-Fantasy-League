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
    seasonId: string
  ): Promise<AxiosResponse<CreateLeagueResponse>> => {
    const apiRequest: CreateLeagueRequest = {
      name: name,
      seasonId: Number(seasonId),
    };
    return await api.league.createLeague(apiRequest, {withCredentials: true});
  },
  getLeaguesForProfile: async (profileId: string): Promise<AxiosResponse<GetLeaguesForProfileResponse>> => {
    return await api.league.getLeaguesForProfile(profileId, {withCredentials: true})
  }
};

export default leagueService;