import logger from "../../config/logger";
import survivorRepository from "../../repositories/survivorRepository";
import { SurvivorWithDetails } from "../../types/survivor/survivorTypes";

const survivorService = {

    getSurvivorsWithDetailsBySeason: async (seasonId: number): Promise<SurvivorWithDetails[]> => {

        const survivors : SurvivorWithDetails[] = await survivorRepository.getSurvivorsWithDetailsInSeason(seasonId);
        logger.debug(`Found survivors for season ${seasonId}`);
        logger.debug(survivors);

        return survivors;
    },
};

export default survivorService;