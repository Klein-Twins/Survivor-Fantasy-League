import { Request, Response, NextFunction } from 'express';
import {
  CreateLeagueResponse,
  GetLeaguesResponse,
  GetLeaguesResponseData,
  League,
} from '../../generated-api';
import logger from '../../config/logger';
import leagueHelper from '../../helpers/league/leagueHelper';
import leagueService from '../../services/league/leagueService';
import { BadRequestError } from '../../utils/errors/errors';
import validator from 'validator';
import { UUID } from 'crypto';

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
    const profileId = req.params.profileId;
    if (!profileId) {
      throw new BadRequestError('Profile ID is required');
    }
    if (validator.isUUID(profileId) === false) {
      throw new BadRequestError('Invalid profile ID');
    }

    const leagues: League[] = await leagueService.getLeaguesForProfile(
      profileId as UUID
    );

    const responseData: GetLeaguesResponseData = {
      leagues,
    };

    const response: GetLeaguesResponse = {
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
    const reqBody = req.body;
    const { name, seasonId, profileId } = leagueHelper.validateCreateLeagueData(
      {
        name: reqBody.name,
        seasonId: reqBody.seasonId,
        profileId: reqBody.profileId,
      }
    );

    const league: League = await leagueService.createLeague({
      name,
      seasonId,
      profileId,
    });

    const response: CreateLeagueResponse = {
      success: true,
      message: 'League created successfully',
      responseData: {
        league: league,
      },
      statusCode: 201,
    };

    res.status(201).json(response);
  } catch (error) {
    logger.debug('Caught error in leagueController.createLeague()');
    next(error);
  }
}

export default leagueController;
