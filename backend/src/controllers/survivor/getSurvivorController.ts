import { Request, Response, NextFunction } from "express";
import errorFactory from "../../utils/errors/errorFactory";
import survivorService from "../../servicesAndHelpers/survivor/getSurvivorService";

/**
 * Controller for handling survivor-related query fetch requests.
 * This controller is responsible for fetching survivor data, including retrieving survivors by season.
 */
const getSurvivorController = {
    /**
     * Fetches the list of survivors for a specific season.
     * 
     * @async
     * @function
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object used to send the response.
     * @param {NextFunction} next - The Express next function to pass control to error-handling middleware.
     * 
     * @returns {Promise<void>} - This function does not return a value, it interacts with the response object
     * to send data or errors.
     * 
     * @throws {Error} - Throws errors if the `seasonId` is missing, not a valid number, or any issues occur
     *                   during the survivor data retrieval process.
     * 
     * @example
     * // Example of a request for survivors by season
     * GET /survivors?seasonId=5
     * 
     * @description
     * This function expects the query parameter `seasonId` to be provided in the request.
     * It first validates that `seasonId` is present and that it can be parsed as a valid integer.
     * If these conditions are met, it retrieves the survivor data for the given season
     * via the `getSurvivorsWithDetailsBySeason` service method.
     * If any validation fails or an error occurs, the function throws an appropriate error
     * and passes it to the next middleware.
     */
    getSurvivorsBySeason: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { seasonId } = req.query;

        try {
            // 1. Validate that seasonId is present
            if (!seasonId) {
                throw errorFactory({ message: "Missing seasonId", statusCode: 400 });
            }

            // 2. Parse seasonId as an integer and ensure it is a valid number
            const season = parseInt(seasonId as string, 10);

            if (isNaN(season)) {
                throw errorFactory({ message: "seasonId must be a valid number", statusCode: 400 });
            }

            // 3. Retrieve survivors for the specified season via the service layer
            const { statusCode, message, survivors } = await survivorService.getSurvivorsWithDetailsBySeason(season);

            // 4. Send the response with the retrieved data
            res.status(statusCode).json({ message, survivors });
        } catch (error) {
            // 5. Pass any errors to the error-handling middleware
            next(error);
        }
    }
};

export default getSurvivorController;