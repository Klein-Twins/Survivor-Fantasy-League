import { NextFunction, Request, RequestHandler, Response } from 'express';
import CustomError, { NotFoundError } from "../../utils/errors/errors";
import { CreateLeagueResponse, GetLeaguesForProfileResponse } from '../../types/league/leagueDto';
import leagueResponseBuilder from "../../servicesAndHelpers/leagues/leagueResponseBuilder";
import leagueService from "../../servicesAndHelpers/leagues/leagueService";
import { LeagueAttributes } from '../../models/League';
import errorHandler from '../../middleware/errorHandlerMiddleware';
import seasonService from '../../servicesAndHelpers/season/seasonService';
import logger from '../../config/logger';
import errorFactory from '../../utils/errors/errorFactory';
import { INVALID_NAME, INVALID_PROFILE_ID, INVALID_SEASON_ID, SEASON_NOT_FOUND } from '../../constants/auth/responseErrorConstants';
import leagueRepository from '../../repositories/leagueRepository';

const leagueController = {
    createLeague: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { seasonId, name, profileId } = req.body;
            const parsedSeasonId = seasonId ? parseInt(seasonId as string, 10) : undefined;
            
            validateCreateLeagueRequest(seasonId, name, profileId);
            const doesSeasonExist: boolean = await seasonService.doesSeasonExist(parsedSeasonId!)
            if (!doesSeasonExist) {
                throw errorFactory(SEASON_NOT_FOUND);
            }
    
            let league : LeagueAttributes = await leagueService.createLeague(seasonId, name, profileId);
            league = await leagueService.getLeagueByLeagueId(league.leagueId)
            const responseBody : CreateLeagueResponse = leagueResponseBuilder.buildCreateLeagueResponse(league);
            res.status(201).json(responseBody);

        } catch (error) {
            logger.debug("Caught error in leagueController.createLeague()")
            next(error)
        }
    },
    getLeaguesForProfile: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { profileId } = req.params;
            validateGetLeaguesForProfileRequest(profileId);

            const leagues: LeagueAttributes[] = await leagueService.getLeaguesForProfile(profileId)
            const responseBody: GetLeaguesForProfileResponse = leagueResponseBuilder.buildGetLeaguesForProfileResponse(leagues);
            res.status(200).json(responseBody);
        } catch (error) {
            logger.debug("Caught error in leagueController.getLeaguesForProfile()")
            next(error)
        }
    }
};

const validateCreateLeagueRequest = (seasonId: number, name: string, profileId: string) : void => {
    if (!seasonId) {
        throw errorFactory(INVALID_SEASON_ID)
    }
    if (!name) {
        throw errorFactory(INVALID_NAME)
    }
    if (!profileId) {
        throw errorFactory(INVALID_PROFILE_ID)
    }
}

const validateGetLeaguesForProfileRequest = (profileId: string) : void => {
    if (!profileId) {
        throw errorFactory(INVALID_PROFILE_ID)
    }
}

export default leagueController;