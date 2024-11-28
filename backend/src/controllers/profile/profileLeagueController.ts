import { Request, Response, NextFunction } from "express";
import logger from "../../config/logger";
import errorFactory from "../../utils/errors/errorFactory";
import { LeagueAttributes } from "../../models/League";
import { CreateLeagueResponse, GetLeaguesForProfileResponse } from "../../types/league/leagueDto";
import leagueResponseBuilder from "../../servicesAndHelpers/leagues/leagueResponseBuilder";
import leagueService from "../../servicesAndHelpers/leagues/leagueService";
import { INVALID_NAME_ERROR, INVALID_PROFILE_ID_ERROR, INVALID_SEASON_ID_ERROR, SEASON_NOT_FOUND_ERROR } from "../../constants/auth/responseErrorConstants";
import seasonService from "../../servicesAndHelpers/season/seasonService";

const profileLeagueController = {
    createLeague: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { seasonId, name, profileId } = req.body;
            const parsedSeasonId = seasonId ? parseInt(seasonId as string, 10) : undefined;

            validateCreateLeagueRequest(seasonId, name, profileId);
            const doesSeasonExist: boolean = await seasonService.doesSeasonExist(parsedSeasonId!)
            if (!doesSeasonExist) {
                throw errorFactory(SEASON_NOT_FOUND_ERROR);
            }

            let league: LeagueAttributes = await leagueService.createLeague(seasonId, name, profileId);
            league = await leagueService.getLeagueByLeagueId(league.leagueId)
            const responseBody: CreateLeagueResponse = leagueResponseBuilder.buildCreateLeagueResponse(league);
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
}

const validateGetLeaguesForProfileRequest = (profileId: string): void => {
    if (!profileId) {
        throw errorFactory(INVALID_PROFILE_ID_ERROR)
    }
}

const validateCreateLeagueRequest = (seasonId: number, name: string, profileId: string): void => {
    if (!seasonId) {
        throw errorFactory(INVALID_SEASON_ID_ERROR)
    }
    if (!name) {
        throw errorFactory(INVALID_NAME_ERROR)
    }
    if (!profileId) {
        throw errorFactory(INVALID_PROFILE_ID_ERROR)
    }
}

export default profileLeagueController;