import survivorService from "../../servicesAndHelpers/survivor/survivorService";
import { Request, Response, NextFunction } from "express";
import { validateQuery } from "../../utils/survivor/survivorUtils";
import logger from "../../config/logger";

const survivorController = {
    getSurvivors: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const seasonId: any = req.query.seasonId;
        const withDetails: any = req.query.withDetails;

        logger.debug(`In survivorController.getSurvivors with query parameters seasonId=${seasonId} and withDetails=${withDetails}`);

        try {
            validateQuery(seasonId);
            const survivors = await survivorService.getSurvivorsWithDetailsBySeason(seasonId);
            res.status(200).json({
                survivors
            })

        } catch (error) {
            next(error);
        }
    }
}

export default survivorController;