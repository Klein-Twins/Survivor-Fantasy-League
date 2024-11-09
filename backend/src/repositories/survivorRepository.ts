import { models } from "../config/db";
import { SurvivorDetailsOnSeasonAttributes } from "../models/SurvivorDetailsOnSeason";
import errorFactory from "../utils/errors/errorFactory";
import logger from "../config/logger";
import { SurvivorsAttributes } from "../models/Survivors";

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
    ): Promise<SurvivorWithDetailsAttributes[]> => {
        try {
            const results = await models.SurvivorDetailsOnSeason.findAll({
                where: { SEASON_ID: seasonId },
                include: [
                    {
                        model: models.Survivors,
                        required: true,
                        attributes: {
                            exclude: ['SURVIVOR_ID'],
                        },
                    },
                ],
            });

            if (results.length === 0) {
                throw errorFactory({
                    message: `No survivors found for season ${seasonId}`,
                    statusCode: 404,
                });
            }

            const formattedResults = results.map(result => ({
                ...result,
                //@ts-ignore
                SURVIVOR: result.Survivor
            })) as SurvivorWithDetailsAttributes[];

            return formattedResults;
        } catch (error) {
            logger.error(`Error retrieving survivors for season ${seasonId}: ${error}`);
            throw error;  // Propagate the error after logging
        }
    },
};

export default survivorRepository;