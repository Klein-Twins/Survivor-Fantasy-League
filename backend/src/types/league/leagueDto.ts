import { APIResponseData } from "../api/apiResponseTypes";
import { LeagueWithDetails } from "./leagueTypes";

export interface CreateLeagueResponse extends APIResponseData {
    league: LeagueWithDetails;
}

export interface CreateLeagueRequest {
    name: string;
    seasonId: number;
    profileId: string;
}

export interface GetLeaguesForProfileResponse extends APIResponseData {
    leagues: LeagueWithDetails[];
}