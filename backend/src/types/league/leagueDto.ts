import { APIResponse } from "../api/apiResponseTypes";
import { LeagueWithDetails } from "./leagueTypes";

export interface CreateLeagueResponse extends APIResponse {
    league: LeagueWithDetails;
}

export interface CreateLeagueRequest {
    name: string;
    seasonId: number;
    profileId: string;
}

export interface GetLeaguesForProfileResponse extends APIResponse {
    leagues: LeagueWithDetails[];
}