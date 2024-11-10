import { models } from "../config/db";
import { SurvivorDetailsOnSeasonAttributes } from "../models/SurvivorDetailsOnSeason";
import errorFactory from "../utils/errors/errorFactory";
import logger from "../config/logger";
import { SurvivorsAttributes } from "../models/Survivors";
import { NOT_FOUND_ERROR } from "../constants/auth/responseErrorConstants";
import { SurvivorWithDetails } from "../types/survivor/survivorTypes";

export interface SurvivorWithDetailsAttributes extends SurvivorDetailsOnSeasonAttributes {
    SURVIVOR : SurvivorsAttributes
}

const survivorRepository = {

    /**
     * Retrieves all survivors with their details for a given season.
     * 
     * @param seasonId - The ID of the season to fetch survivors for.
     * @returns A promise that resolves to an array of survivor details for the season.
     * @throws A 404 error if no survivors are found for the given season.
     */
    getSurvivorsWithDetailsInSeason: async (
        seasonId: number
    ): Promise<SurvivorWithDetails[]> => {
        try {
            const results = await models.SurvivorDetailsOnSeason.findAll({
                where: { SEASON_ID: seasonId },
                include: [
                    {
                        model: models.Survivors,
                        required: true,
                        as: 'Survivor',
                        attributes: {
                            exclude: ['SURVIVOR_ID'],
                        },
                    },
                ],
            }) as unknown as SurvivorWithDetails[]

            if (results.length === 0) {
                throw errorFactory({
                    message: `No survivors found for season ${seasonId}`,
                    statusCode: NOT_FOUND_ERROR.statusCode,
                });
            }
            
            return results;
        } catch (error) {
            logger.error(`Error retrieving survivors from DB for season ${seasonId}: ${error}`);
            throw error;
        }
    },
};

export default survivorRepository;