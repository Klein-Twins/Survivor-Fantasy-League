import survivorRepository from "../../repositories/survivorRepository";

import getSurvivorResponseDataFormatter from "../../utils/apiResponseFormatters/survivorResponseFormatter";
import errorFactory from "../../utils/errors/errorFactory";
import { transformSurvivorWithDetailsData } from "../../utils/transformers/survivorTransformers";

import { SurvivorsWithDetailsBySeasonResponseData } from "../../types/survivor/survivorTypes";

/**
 * Service layer for get survivor-related operations.
 *
 * Provides functions to retrieve survivor data based on a specified season.
 * This layer abstracts business logic, ensuring data validation and formatting
 * while handling any errors through a unified `errorFactory`.
 */
const getSurvivorService = {
    /**
     * Retrieves detailed survivor data for a specific season.
     *
     * Fetches survivor information using the season ID, applies transformations
     * to the data, and formats the response. If no survivors are found, throws
     * a `NotFoundError` with a custom error message.
     *
     * ### Parameters:
     * - `seasonId` - ID of the season (integer) for which to retrieve survivor data.
     *
     * ### Returns:
     * - A `SurvivorsWithDetailsBySeasonResponseData` object containing:
     *   - `statusCode`: The HTTP status code for the response.
     *   - `message`: A descriptive success message.
     *   - `survivors`: An array of transformed survivor data.
     *
     * ### Throws:
     * - A `NotFoundError` (via `errorFactory`) if no survivors are found for the given season.
     *
     * @param seasonId - Numeric ID representing the season.
     * @returns A promise that resolves to a structured response object.
     * @throws Will throw an error if no survivors are found for the provided season ID.
     */
    getSurvivorsWithDetailsBySeason: async (seasonId: number): Promise<SurvivorsWithDetailsBySeasonResponseData> => {
        // Fetch survivor data from the repository
        const survivors = await survivorRepository.getSurvivorsWithDetailsInSeason(seasonId);

        // Check if survivors were found; if not, throw a 404 error
        if (!survivors || survivors.length === 0) {
            throw errorFactory({
                message: `No survivors found for season ${seasonId}`,
                statusCode: 404,
            });
        }

        // Transform survivor data for the response
        const transformedSurvivors = survivors.map(transformSurvivorWithDetailsData);

        // Format the response using the specified formatter
        return getSurvivorResponseDataFormatter.formatgetSurvivorsWithDetailsBySeasonResponse(
            200,
            `Successfully retrieved survivors for season ${seasonId}`,
            transformedSurvivors
        );
    },
};

export default getSurvivorService;