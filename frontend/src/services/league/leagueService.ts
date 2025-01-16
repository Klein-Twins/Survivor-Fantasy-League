import { AxiosResponse } from "axios";
import { InviteMemberResponse, LeagueResponse, ProfileInviteBody, ProfileLeaguesBody, ProfileLeaguesResponse } from "../../../generated-api";
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

    const response: AxiosResponse<LeagueResponse> = await api.profile.createLeague(
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
  ): Promise<ProfileLeaguesResponse> => {
    const response = await api.profile.getLeaguesForProfile(profileId, {
      withCredentials: true,
    });

    console.log(response.data);
    return response.data;
  },

  inviteLeagueMember: async (body: ProfileInviteBody, profileId: string): Promise<InviteMemberResponse> => {
    const response = await api.league.inviteToLeague(body, profileId, { withCredentials: true });
    return response.data;
  }
};

export default leagueService;