import { LeagueAttributes } from "../../models/League";

export type LeagueWithDetails = Omit<LeagueAttributes, "SEASON_ID">;