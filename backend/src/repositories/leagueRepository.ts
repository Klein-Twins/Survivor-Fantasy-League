import { models } from "../config/db";
import { LeagueAttributes } from "../models/League";

const leagueRepository = {
    createLeague: async (seasonId: number, name: string) : Promise<LeagueAttributes> => {
        return await models.League.create({
            seasonId: seasonId,
            name: name
        })
    },
    findLeagueByLeagueId: async (leagueId: string) : Promise<LeagueAttributes | null> => {
        return await models.League.findByPk(leagueId, {
            include: [{
                model: models.Seasons,
                as: 'season'
            }]
        })
    }
};

export default leagueRepository;