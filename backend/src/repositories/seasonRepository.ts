import { models } from "../config/db";
import logger from "../config/logger";
import errorFactory from "../utils/errors/errorFactory";
import { NOT_FOUND_ERROR } from "../constants/auth/responseErrorConstants";
import { SeasonsAttributes } from "../models/Seasons";

const seasonRepository = {

    /**
     * Retrieves a pr∏ofile by its Profile ID.
     * 
     * @param profileId - The ID of the profile to retrieve.
     * 
     * @returns A promise that resolves to the profile record.
     */
    getSeasonBySeasonId: async (
        seasonId: SeasonsAttributes["SEASON_ID"]
    ): Promise<SeasonsAttributes | null> => {
        try {
            const season = await models.Seasons.findOne({
                where: { SEASON_ID: seasonId },
            });
            if (season) {
                logger.debug('Season record found by Season ID:', season.toJSON());
                return season;
            } else {
                logger.debug(`Season record was NOT found using Season ID: ${seasonId}`);
                return null;
            }
        } catch (error) {
            logger.error(`Failed to get season record by season id ${seasonId}: ${error}`);
            throw error;
        }
    }
};

export default seasonRepository;