import { Request, Response, NextFunction } from 'express';
import {
  CreateLeagueRequestBody,
  CreateLeagueResponse,
  CreateLeagueResponseData,
  GetLeaguesForProfileResponse,
  GetLeaguesForProfileResponseData,
} from '../../generated-api';
import leagueService from '../../services/league/leagueService';
import logger from '../../config/logger';

const leagueController = {
  createLeague,
  getLeague,
};

async function getLeague(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const profileId = req.query.profileId as string;

    const responseData: GetLeaguesForProfileResponseData =
      await leagueService.getLeaguesForProfile(profileId);

    const response: GetLeaguesForProfileResponse = {
      success: true,
      message:
        responseData.leagues.length !== 0
          ? 'Leagues retrieved successfully'
          : 'You have no torches. Join a league to start playing.',
      responseData,
      statusCode: 200,
    };

    res.status(200).json(response);
  } catch (error) {
    logger.debug('Caught error in leagueController.getLeague()');
    next(error);
  }
}

async function createLeague(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const reqBody: CreateLeagueRequestBody = req.body;

    const responseData: CreateLeagueResponseData =
      await leagueService.createLeague(reqBody);

    const response: CreateLeagueResponse = {
      success: true,
      message: 'League created successfully',
      responseData,
      statusCode: 201,
    };

    res.status(201).json(response);
  } catch (error) {
    logger.debug('Caught error in leagueController.createLeague()');
    next(error);
  }
}

export default leagueController;
