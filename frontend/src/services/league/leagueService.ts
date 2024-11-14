import { AxiosResponse } from "axios";
import {
  CreateLeagueRequest,
  CreateLeagueResponse,
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
};

export default leagueService;