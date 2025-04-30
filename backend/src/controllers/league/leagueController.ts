import { NextFunction, Request, Response } from 'express';
import { ProfileAttributes } from '../../models/account/Profile';
import { SeasonsAttributes } from '../../models/season/Seasons';
import leagueControllerHelper from './leagueControllerHelper';
import { LeagueService } from '../../services/league/LeagueService';
import { CreateLeagueResponse } from '../../generated-api';
import { container } from 'tsyringe';

const leagueController = {
  createLeague,
  getLeagues,
};

export type CreateLeaguePathParams = {
  profileId: ProfileAttributes['profileId'];
  seasonId: SeasonsAttributes['seasonId'];
};

export type GetLeaguePathParams = {
  profileId: ProfileAttributes['profileId'];
  seasonId: SeasonsAttributes['seasonId'];
};

async function getLeagues(req: Request, res: Response, next: NextFunction) {
  const { profileId, seasonId } = req.params;
  try {
    const getLeagueRequest = leagueControllerHelper.validateGetLeaguesRequest({
      profileId,
      seasonId,
    });

    const leagueService = container.resolve(LeagueService);

    const leagues = await leagueService.fetchLeagues({
      profileId: getLeagueRequest.pathParams.profileId,
      seasonId: getLeagueRequest.pathParams.seasonId,
    });

    const response = {
      success: true,
      statusCode: 200,
      message: 'Leagues retrieved successfully',
      responseData: {
        leagues: leagues.map((league) => league.toDTO()),
      },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

async function createLeague(req: Request, res: Response, next: NextFunction) {
  const { profileId, seasonId } = req.params;
  const { name } = req.body;

  try {
    const createLeagueRequest =
      leagueControllerHelper.validateCreateLeagueRequest({
        profileId,
        seasonId,
        name,
      });

    const leagueService = container.resolve(LeagueService);

    const league = await leagueService.createLeague({
      profileId: createLeagueRequest.pathParams.profileId,
      seasonId: createLeagueRequest.pathParams.seasonId,
      name: createLeagueRequest.body.name,
    });

    const response: CreateLeagueResponse = {
      success: true,
      statusCode: 201,
      message: 'League created successfully',
      responseData: {
        league: league.toDTO(),
      },
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
}

export default leagueController;
