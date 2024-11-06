import { models } from "../../config/db";
import { League } from "../../models/Leagues";

export const createLeague = async (seasonId: number, leagueName: string): Promise<League> => {
    // Directly return the newly created League instance
    return models.League.create({
        SEASON_ID: seasonId,
        NAME: leagueName
    });
};
