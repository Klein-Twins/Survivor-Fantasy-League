import { models } from "../config/db";
import { LeagueAttributes } from "../models/Leagues";

const leagueRepository = {
    createLeague: async (seasonId: number, name: string) : Promise<LeagueAttributes> => {
        return await models.Leagues.create({
            SEASON_ID: seasonId,
            NAME: name
        })
    },
};

export default leagueRepository;