import { models } from "../config/db";
import errorFactory from "../utils/errors/errorFactory";
import logger from "../config/logger";
import { NOT_FOUND_ERROR } from "../constants/auth/responseErrorConstants";
import { SurvivorDetailsOnSeasonIncludeSurvivors } from "../types/survivor/survivorTypes";

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
    ): Promise<SurvivorDetailsOnSeasonIncludeSurvivors[]> => {
        try {
            const results = await models.SurvivorDetailsOnSeason.findAll({
                where: { seasonId },
                include: [
                    {
                        model: models.Survivors,
                        required: true,
                        as: 'Survivor',
                        attributes: {
                            exclude: ['survivorId'],
                        },
                    },
                ],
            }) as unknown as SurvivorDetailsOnSeasonIncludeSurvivors[]

            if (results.length === 0) {
                throw errorFactory({
                    error: `No survivors found for season ${seasonId}`,
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