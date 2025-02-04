import { Request, Response, NextFunction } from 'express';
import leagueControllerHelper from './leagueControllerHelper';
import leagueService from '../../servicesAndHelpers/leagues/leagueService';
import { ApiError, CreateLeagueResponse, GetLeaguesForProfileResponse, League } from '../../generated-api';
import logger from '../../config/logger';
import { CreateLeagueRequest } from '../../types/league/leagueDto';
import accountService from '../../servicesAndHelpers/auth/accountService';
import { InviteStatusEnum } from '../../models/league/LeagueProfile';

const leagueController = {
  createLeague,
  getLeaguesForProfile,
};

async function createLeague(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const reqBody: CreateLeagueRequest = req.body;

    leagueControllerHelper.validateCreateLeagueRequest(reqBody);
    const formattedReqBody: CreateLeagueRequest = leagueControllerHelper.formatCreateLeagueRequest(reqBody);

    const league: League = await leagueService.createLeague(formattedReqBody);
    if (!league) {
      const error: ApiError = {
        error: 'Failed to create league. Please try again.',
        statusCode: 500,
        success: false,
        message: 'Failed to create league. Please try again.',
      };
      throw error;
    }

    const response: CreateLeagueResponse = {
      success: true,
      message: 'League created successfully',
      responseData: {
        league,
      },
      statusCode: 201,
    };

    res.status(201).json(response);
  } catch (error) {
    logger.debug('Caught error in leagueController.createLeague()');
    next(error);
  }
}
async function getLeaguesForProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const profileId: string = req.query.profileId as string;

    if (!leagueControllerHelper.validateGetLeaguesForProfileRequest(profileId)) {
      const error: ApiError = {
        error: 'Bad Request',
        statusCode: 400,
        success: false,
        message: 'Invalid profileId',
      };
      throw error;
    }
    const account = await accountService.getAccountByProfileId(profileId);

    const leagues: League[] = await leagueService.getLeaguesForProfileId(profileId, InviteStatusEnum.Accepted);

    const response: GetLeaguesForProfileResponse = {
      success: true,
      statusCode: 200,
      message: 'Leagues retrieved successfully',
      responseData: {
        leagues,
      },
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

export default leagueController;
