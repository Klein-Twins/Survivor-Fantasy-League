import { LeagueAttributes } from "../../models/League";
import { LeagueProfileAttributes } from "../../models/LeagueProfile";
import { ProfileAttributes } from "../../models/Profile";
import { UserAttributes } from "../../models/User";

export type ProfileSearchParams = {
    userName?: string;
    firstName?: string;
    lastName?: string;
    leagueId: LeagueAttributes['leagueId'];
    page: number;
    limit: number;
    sortBy: string;
    isAsc: string;
}

export interface ProfileSearchResultWithTotalCount extends ProfileSearchResult {
    totalCount: number;
}

export interface ProfileSearchResult {
    profileId: ProfileAttributes["profileId"],
    lastName?: ProfileAttributes["lastName"],
    firstName?: ProfileAttributes["firstName"],
    imageUrl: ProfileAttributes["imageUrl"],
    userName: UserAttributes["userName"],
    inviteStatus: LeagueProfileAttributes['inviteStatus'] | null,
}

export interface ProfileSearchResultsWithPagination {
    searchResults: ProfileSearchResult[],
    pagination: Pagination
}

export interface Pagination {
    totalPages: number,
    totalCount: number,
    currentPage: number,
}

export enum ProfileSearchSortBy {
    FirstName = 'firstName',
    LastName = 'lastName',
    UserName = '$User.userName$',
    UpdatedAt = 'UPDATED_AT',
}

export enum ProfileSearchSortDirection {
    Ascending = 'ASC',
    Descending = 'DESC'
}

export interface Profile {
    profileId: string;
    userName: string;
    firstName: string | null;
    lastName: string | null;
    profileImageUrl: string | null;


}