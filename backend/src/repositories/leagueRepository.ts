import { models } from "../config/db";
import { LeagueAttributes } from "../models/Leagues";

const leagueRepository = {
    createLeague: async (seasonId: number, name: string) : Promise<LeagueAttributes> => {
        return await models.Leagues.create({
            seasonId: seasonId,
            name: name
        })
    },
    findLeagueByLeagueId: async (leagueId: number) : Promise<LeagueAttributes | null> => {
        return await models.Leagues.findByPk(leagueId, {
            include: [{
                model: models.Seasons,
                as: 'season'
            }]
        })
    }
};

export default leagueRepository;