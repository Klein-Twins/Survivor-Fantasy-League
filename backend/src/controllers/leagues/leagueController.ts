import { NextFunction, Request, RequestHandler, Response } from 'express';
import CustomError, { NotFoundError } from "../../utils/errors/errors";
import { CreateLeagueResponse } from '../../types/league/leagueDto';
import leagueResponseBuilder from "../../servicesAndHelpers/leagues/leagueResponseBuilder";
import leagueService from "../../servicesAndHelpers/leagues/leagueService";
import { LeagueAttributes } from '../../models/Leagues';
import errorHandler from '../../middleware/errorHandlerMiddleware';
import seasonService from '../../servicesAndHelpers/season/seasonService';

const leagueController = {
    createLeague: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

        const doesSeasonExist: boolean = await seasonService.doesSeasonExist(parsedSeasonId)
        if (!doesSeasonExist) {
            const error: NotFoundError = new NotFoundError(`Season with seasonId ${parsedSeasonId} does not exist.`);
            errorHandler(error, req, res, next);
            return;
        }
    
        try {            
            let league : LeagueAttributes = await leagueService.createLeague(seasonId, name);
            league = await leagueService.getLeagueByLeagueId(league.LEAGUE_ID)
            const responseBody : CreateLeagueResponse = leagueResponseBuilder.buildCreateLeagueResponse(league);

            res.status(201).json(responseBody);
        } catch (error) {
            errorHandler(error, req, res, next)        
        }
    }
};

export default leagueController;