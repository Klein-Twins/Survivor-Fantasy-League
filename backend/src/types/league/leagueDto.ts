import { LeagueAttributes } from "../../models/Leagues";
import { APIResponseData } from "../api/apiResponseTypes";
import { LeagueWithDetailsObject } from "./leagueTypes";

export interface CreateLeagueResponse extends APIResponseData {
    league: LeagueWithDetailsObject;
}

export  interface CreateLeagueRequest {
    name: string;
    seasonId: number;
}