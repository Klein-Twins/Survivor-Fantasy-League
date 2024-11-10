import { SeasonWithDetailsObject } from "../season/seasonTypes";

export interface LeagueWithDetailsObject {
    leagueId: number;
    name: string;
    season: SeasonWithDetailsObject
}