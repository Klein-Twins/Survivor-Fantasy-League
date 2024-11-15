import { CreateOptions } from "sequelize";
import { models } from "../config/db";
import { LeagueAttributes } from "../models/League";
import { LeagueProfileAttributes } from "../models/LeagueProfile";

const leagueRepository = {
    createLeague: async (seasonId: number, name: string, options: CreateOptions) : Promise<LeagueAttributes> => {
        return await models.League.create({
            seasonId: seasonId,
            name: name
        }, options)
    },
    findLeagueByLeagueId: async (leagueId: string) : Promise<LeagueAttributes | null> => {
        return await models.League.findByPk(leagueId, {
            include: [{
                model: models.Seasons,
                as: 'season'
            }]
        })
    },
    createLeagueProfile: async (profileId: string, leagueId: string, role: string, options: CreateOptions) : Promise<LeagueProfileAttributes> => {
        return await models.LeagueProfile.create({
            leagueId: leagueId,
            profileId: profileId,
            role: role
        }, options)
    },
    findLeagueProfileByProfileId: async (profileId: string) : Promise<LeagueProfileAttributes[]> => {
        return await models.LeagueProfile.findAll({
            where: {
                profileId: profileId
            }
        })
    }
};

export default leagueRepository;