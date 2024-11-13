import { NextFunction, Request, RequestHandler, Response } from 'express';
import CustomError, { NotFoundError } from "../../utils/errors/errors";
import { CreateLeagueResponse } from '../../types/league/leagueDto';
import leagueResponseBuilder from "../../servicesAndHelpers/leagues/leagueResponseBuilder";
import leagueService from "../../servicesAndHelpers/leagues/leagueService";
import { LeagueAttributes } from '../../models/League';
import errorHandler from '../../middleware/errorHandlerMiddleware';
import seasonService from '../../servicesAndHelpers/season/seasonService';
import logger from '../../config/logger';
import errorFactory from '../../utils/errors/errorFactory';
import { INVALID_NAME, INVALID_SEASON_ID, SEASON_NOT_FOUND } from '../../constants/auth/responseErrorConstants';

const leagueController = {
    createLeague: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { seasonId, name } = req.body;
            const parsedSeasonId = seasonId ? parseInt(seasonId as string, 10) : undefined;
            
            validateCreateLeagueRequest(seasonId, name);
            const doesSeasonExist: boolean = await seasonService.doesSeasonExist(parsedSeasonId!)
            if (!doesSeasonExist) {
                throw errorFactory(SEASON_NOT_FOUND);
            }
    
            let league : LeagueAttributes = await leagueService.createLeague(seasonId, name);
            league = await leagueService.getLeagueByLeagueId(league.leagueId)
            const responseBody : CreateLeagueResponse = leagueResponseBuilder.buildCreateLeagueResponse(league);
            res.status(201).json(responseBody);

        } catch (error) {
            logger.debug("Caught error in leagueController.createLeague()")
            next(error)
        }

    }
};

const validateCreateLeagueRequest = (seasonId: number, name: string) : void => {
    if (!seasonId) {
        throw errorFactory(INVALID_SEASON_ID)
    }
    if (!name) {
        throw errorFactory(INVALID_NAME)
    }
}

export default leagueController;