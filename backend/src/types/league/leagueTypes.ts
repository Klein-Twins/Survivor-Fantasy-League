import { LeagueAttributes } from "../../models/Leagues";

export type LeagueWithDetails = Omit<LeagueAttributes, "SEASON_ID">;