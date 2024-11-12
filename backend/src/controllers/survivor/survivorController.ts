import survivorService from "../../servicesAndHelpers/survivor/survivorService";
import { Request, Response, NextFunction } from "express";
import { validateQuery } from "../../utils/survivor/survivorUtils";

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

export default survivorController;