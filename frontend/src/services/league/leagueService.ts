import { AxiosResponse } from "axios";
import { InlineResponse2012, ProfileLeaguesBody, ProfileLeaguesResponseSuccessSchema } from "../../../generated-api";
import api from "../apiContainer";

const leagueService = {
  createLeague: async (
    name: string,
    seasonId: number,
    profileId: string
  ): Promise<any> => {
    const requestBody: ProfileLeaguesBody = {
      name,
      seasonId: Number(seasonId),
      profileId,
    };

    const response: AxiosResponse<InlineResponse2012> = await api.profile.createLeague(
      requestBody,
      profileId,
      undefined,
      { withCredentials: true }
    );

    console.log("Logging createLeague response:")
    console.log(response.data);

    return response.data;
  },

  getLeaguesForProfile: async (
    profileId: string
  ): Promise<ProfileLeaguesResponseSuccessSchema> => {
    const response = await api.profile.getLeaguesForProfile(profileId, {
      withCredentials: true,
    });

    console.log(response.data);
    return response.data;
  },
};

export default leagueService;