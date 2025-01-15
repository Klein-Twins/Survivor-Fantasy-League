import { AxiosResponse } from "axios";
import api from "../apiContainer";
import { ProfileSearchResultsResponse } from "../../../generated-api";

export interface GetProfilesBySearchRequestData {
    profileId: string;
    userName?: string;
    firstName?: string;
    lastName?: string;
    leagueId: string;
    page?: number;
    limit?: number;
    sortBy?: "firstName" | "lastName" | "userName";
    isAsc?: boolean;
}

export interface ProfileSearchFormValues {
    userName?: string;
    firstName?: string;
    lastName?: string;
    sortBy?: "firstName" | "lastName" | "userName";
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
    getProfilesBySearch: async (params: GetProfilesBySearchRequestData): Promise<GetProfilesBySearchResponse> => {
        console.log(params);
        const response: AxiosResponse<ProfileSearchResultsResponse> = await api.league.searchProfilesForLeagueInvite(
            params.leagueId,
            params.profileId,
            params.userName,
            params.firstName,
            params.lastName,
            params.page,
            params.limit,
            params.sortBy,
            params.isAsc,
            { withCredentials: true }
        );

        const data = response.data;
        if (!data.results || !data.results.searchResults || !data.results.pagination) {
            throw new Error("Invalid response structure");
        }

        if (!data.message) {
            data.message = "No message provided";
        }

        if (data.foundResults === undefined) {
            data.foundResults = false;
        }


        const validSearchResults = data.results.searchResults.filter(result => result.profileId !== undefined) as ProfileSearchResults;
        return {
            results: {
                searchResults: validSearchResults,
                pagination: data.results.pagination,
            },
            message: data.message,
            foundResults: data.foundResults
        };
    }
}

export default profileService;