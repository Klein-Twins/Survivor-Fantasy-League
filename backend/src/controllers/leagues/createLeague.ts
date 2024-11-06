import { NextFunction, Request, RequestHandler, Response } from 'express';
import errorHandler, { CustomError } from '../../middleware/errorHandler';
import { League } from '../../models/Leagues';
import { createLeague } from '../../services/leagues/leagueService';

export interface CreateLeagueResponse {
    league: League;
}

const createLeagueController: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { seasonId, name } = req.body;
    console.log(req.body);

    const parsedSeasonId = seasonId ? parseInt(seasonId as string, 10) : undefined;

    if (!parsedSeasonId || !name) {
        const error:  CustomError = {
            statusCode: 400, 
            message: "Request is missing one of the required fields: seasonId, name",
            name: 'Missing Required Fields'
        }
        errorHandler(error, req, res, next);
        return;
    }

    try {
        const league: League = await createLeague(parsedSeasonId, name as string);
        const responseBody : CreateLeagueResponse = { league: league }
        res.status(201).json({ responseBody });
    } catch (error) {
        errorHandler(error, req, res, next)        
    }
};

export {
    createLeagueController
};

