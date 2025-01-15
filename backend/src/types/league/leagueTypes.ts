import { LeagueAttributes } from "../../models/League";
import { APIResponse } from "../api/apiResponseTypes";

export type LeagueWithDetails = Omit<LeagueAttributes, "SEASON_ID">;


export interface LeagueInviteRequest {
    leagueId: string;
    inviteeProfileId: string;
    inviterProfileId: string;
    inviteMessage?: string;
}

export interface LeagueInviteResponse extends APIResponse {
    success: boolean;
    data?: any;
}