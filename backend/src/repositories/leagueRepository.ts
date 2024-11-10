import { models } from "../config/db";
import { LeagueAttributes } from "../models/Leagues";

const leagueRepository = {
    createLeague: async (seasonId: number, name: string) : Promise<LeagueAttributes> => {
        return await models.Leagues.create({
            SEASON_ID: seasonId,
            NAME: name
        })
    },
    findLeagueByLeagueId: async (leagueId: number) : Promise<LeagueAttributes | null> => {
        return await models.Leagues.findByPk(leagueId, {
            include: [{
                model: models.Seasons,
                as: 'SEASON'
            }]
        })
    }
};

export default leagueRepository;