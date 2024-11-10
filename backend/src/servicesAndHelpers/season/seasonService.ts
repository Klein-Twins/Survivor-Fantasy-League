import { NOT_FOUND_ERROR } from "../../constants/auth/responseErrorConstants";
import { SeasonsAttributes } from "../../models/Seasons";
import seasonRepository from "../../repositories/seasonRepository";
import errorFactory from "../../utils/errors/errorFactory";


const seasonService = {
    getSeasonBySeasonId: async (seasonId: number): Promise<SeasonsAttributes> => {
        const season: SeasonsAttributes | null = await seasonRepository.getSeasonBySeasonId(seasonId);
        if (!season) {
            throw errorFactory(NOT_FOUND_ERROR)
        };
        return season;
    },

    doesSeasonExist : async (seasonId: number): Promise<boolean> => {
        const season: SeasonsAttributes | null = await seasonRepository.getSeasonBySeasonId(seasonId);
        return season !== null;
    }
};

export default seasonService;
