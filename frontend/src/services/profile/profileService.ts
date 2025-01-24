import { AxiosResponse } from "axios";
import api from "../apiContainer";
import { ApiResponse, RespondToLeagueInviteRequestBody, RespondToLeagueInviteResponse, SearchProfilesForLeagueInviteResponse, SortByEnum } from "../../../generated-api";
import { InviteStatusEnum } from "../../types/leagueProfile";
import { ApiRequestParams } from "../../hooks/useApi";

export interface GetProfilesBySearchRequestData {
    // profileId: string;
    userName?: string;
    firstName?: string;
    lastName?: string;
    leagueId: string;
    page?: number;
    limit?: number;
    sortBy?: SortByEnum
    isAsc?: boolean;
}

export interface ProfileSearchFormValues {
    userName?: string;
    firstName?: string;
    lastName?: string;
    sortBy?: SortByEnum
    isAsc?: boolean;
    numProfilesPerPage: number
}

export interface GetProfilesBySearchResponse {
    results: {
        searchResults: ProfileSearchResults
        pagination: Pagination
    };
    message: string;
    foundResults: boolean;
}

export type ProfileSearchResults = Array<ProfileSearchResult>;

export type ProfileSearchResult = {
    profileId: string;
    userName: string;
    firstName: string;
    lastName: string;
    imageUrl: string;
    inviteStatus: "pending" | "accepted" | null;
}
export type Pagination = {
    currentPage: number;
    totalPages: number;
    totalCount: number;
}

const profileService = {
    getProfilesBySearch: async (params: ApiRequestParams<void, GetProfilesBySearchRequestData>): Promise<AxiosResponse<SearchProfilesForLeagueInviteResponse>> => {
        console.log(params);
        const response: AxiosResponse<SearchProfilesForLeagueInviteResponse> = await api.profileService.searchProfilesForLeagueInvite(
            params.queryParams.leagueId,
            //params.queryParams.profileId,
            params.queryParams.userName,
            params.queryParams.firstName,
            params.queryParams.lastName,
            params.queryParams.page,
            params.queryParams.limit,
            params.queryParams.sortBy,
            params.queryParams.isAsc,
            { withCredentials: true }
        );
        return response;
    },
}

export default profileService;