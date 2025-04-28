import { NextFunction, Request, Response } from 'express';
import { ProfileAttributes } from '../../models/account/Profile';
import { SeasonsAttributes } from '../../models/season/Seasons';
import leagueControllerHelper from './leagueControllerHelper';
import { LeagueService } from '../../services/league/LeagueService';
import { CreateLeagueResponse } from '../../generated-api';

const leagueController = {
  createLeague,
};

export type CreateLeaguePathParams = {
  profileId: ProfileAttributes['profileId'];
  seasonId: SeasonsAttributes['seasonId'];
};

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

    const league = await LeagueService.createLeague({
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
