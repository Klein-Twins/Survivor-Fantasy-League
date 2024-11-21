import { AxiosResponse } from "axios";
import api from "../apiContainer";

export interface GetProfilesBySearchParams {
    userName?: string;
    firstName?: string;
    lastName?: string;
    leagueId?: string;
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
    getProfilesBySearch: async (params: GetProfilesBySearchParams): Promise<AxiosResponse<GetProfilesBySearchResponse>> => {
        console.log(params);
        const response = await api.profile.apiProfileGetProfilesBySearchGet(
            params.userName,
            params.firstName,
            params.lastName,
            params.leagueId,
            params.page,
            params.limit,
            params.sortBy,
            params.isAsc,
            { withCredentials: true }
        );

        return response as AxiosResponse<GetProfilesBySearchResponse>;
    }
}

export default profileService;