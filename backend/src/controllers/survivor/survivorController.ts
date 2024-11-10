import survivorService from "../../servicesAndHelpers/survivor/survivorService";
import { Request, Response, NextFunction } from "express";
import errorFactory from "../../utils/errors/errorFactory";

const survivorController = {
    getSurvivorWithDetailsForSeason : async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const seasonId : any = req.query.seasonId;

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

const validateQuery = (seasonId : any): void => {
    // 1. Validate that seasonId is present
    if (!seasonId) {
        throw errorFactory({ message: "Missing seasonId", statusCode: 400 });
    }

    // 2. Parse seasonId as an integer and ensure it is a valid number
    const season = parseInt(seasonId as string, 10);
    if (isNaN(season)) {
        throw errorFactory({ message: "seasonId must be a valid number", statusCode: 400 });
    }
}

export default survivorController;