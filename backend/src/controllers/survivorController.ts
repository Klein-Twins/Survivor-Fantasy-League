import { Request, Response, NextFunction } from "express";
import errorFactory from "../utils/errorFactory";
import survivorService from "../services/survivors/survivorService";

const survivorController = {
    getSurvivorsBySeasonController: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const {seasonId} = req.query;
        try {
            if(!seasonId) throw errorFactory({message: "Missing seasonId", statusCode: 400});
            const season : number = parseInt(seasonId as string, 10);
            if(!Number.isInteger(season)) throw errorFactory({message: "seasonId must be a number", statusCode: 400});
            
            const { statusCode, message, survivors } = await survivorService.getSurvivorsInSeason(seasonId);
            res.status(statusCode).json({ message, survivors });
            return;
        } catch (error) {
            return next(error);
        }
    }
}

export default survivorController;