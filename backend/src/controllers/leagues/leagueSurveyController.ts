import { NextFunction, Request, Response } from 'express';
import surveyService from '../../servicesAndHelpers/leagues/surveyService';
import { GetSurveyForEpisodeForLeagueMember, LeagueSurvey } from '../../generated-api';
import { BadRequestError } from '../../utils/errors/errors';

async function getSurveyForLeagueMember(req: Request, res: Response, next: NextFunction) {
  try {
    const leagueId = req.params.leagueId;
    const profileIds = Array.isArray(req.query.profileId)
      ? (req.query.profileId as string[])
      : req.query.profileId
      ? [req.query.profileId as string]
      : [];
    const episodeNumbers = Array.isArray(req.query.episodeNumber)
      ? (req.query.episodeNumber as string[]).map(Number)
      : req.query.episodeNumber
      ? [Number(req.query.episodeNumber)]
      : [];

    if (episodeNumbers.some(isNaN)) {
      throw new BadRequestError('Invalid episode number format. All values must be numbers.');
    }

    const leagueSurveys: LeagueSurvey[] = await surveyService.getSurveys(leagueId, profileIds, episodeNumbers);

    const response: GetSurveyForEpisodeForLeagueMember = {
      success: true,
      message: 'Successfully retrieved league surveys',
      statusCode: 200,
      responseData: {
        leagueSurveys,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

const leagueSurveyController = {
  getSurveyForLeagueMember,
};

export default leagueSurveyController;
