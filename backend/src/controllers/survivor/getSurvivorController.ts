import { Request, Response, NextFunction } from "express";
import errorFactory from "../../utils/errors/errorFactory";
import survivorService from "../../servicesAndHelpers/survivor/getSurvivorService";

const getSurvivorController = {

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
            //const { statusCode, message, survivors } = await survivorService.getSurvivorsWithDetailsBySeason(season);

            // 4. Send the response with the retrieved data
            res.status(501).json({ message: "to be implemented" });
        } catch (error) {
            // 5. Pass any errors to the error-handling middleware
            next(error);
        }
    }
};

export default getSurvivorController;