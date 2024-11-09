import survivorRepository from "../../repositories/survivorRepository";
import errorFactory from "../../utils/errors/errorFactory";

const getSurvivorService = {

    getSurvivorsWithDetailsBySeason: async (seasonId: number): Promise<void> => {
        // Fetch survivor data from the repository
        const survivors = await survivorRepository.getSurvivorsWithDetailsInSeason(seasonId);

        // Check if survivors were found; if not, throw a 404 error
        if (!survivors || survivors.length === 0) {
            throw errorFactory({
                message: `No survivors found for season ${seasonId}`,
                statusCode: 404,
            });
        }

        //TODO FIX
    },
};

export default getSurvivorService;