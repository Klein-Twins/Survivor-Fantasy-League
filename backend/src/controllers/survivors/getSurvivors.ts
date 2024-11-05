import { Request, RequestHandler, Response, NextFunction } from 'express';
import errorHandler from '../../middleware/errorHandler';
import { getSurvivorsBySeasonService } from '../../services/survivors/getSurvivors';

const getSurvivorsBySeasonController: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { seasonId } = req.query;
    try {
        const { statusCode, message, survivors } = await getSurvivorsBySeasonService(seasonId as string); // Cast seasonId to string
        console.log(statusCode, message, survivors);
        res.status(statusCode).json({ message, survivors });
        return;
    } catch (error) {
        errorHandler(error, req, res, next);
        return;
    }
};

export {
    getSurvivorsBySeasonController
};