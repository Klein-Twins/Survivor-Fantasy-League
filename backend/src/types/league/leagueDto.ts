import { APIResponse } from "../api/apiResponseTypes";
import { LeagueWithDetails, RespondLeagueInvite } from "./leagueTypes";

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



export interface RespondToLeagueInviteRequest {
    leagueId: string;
    inviteResponse: RespondLeagueInvite;
}

export interface RespondToLeagueInviteResponse extends APIResponse {
    success: boolean;
    message: string;
    responseData?: any;
    statusCode: number
}