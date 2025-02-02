import { NextFunction, Request, Response } from 'express';
import picksService from '../../servicesAndHelpers/picks/picksService';
import surveyService from '../../servicesAndHelpers/leagues/surveyService';
import {
  GetSurveyForEpisodeForLeagueMember,
  GetSurveyForEpisodeForLeagueMemberResponseData,
  LeagueSurvey,
  SurveyType,
} from '../../generated-api';
import errorFactory from '../../utils/errors/errorFactory';

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
      throw errorFactory({
        error: 'Invalid episode number format. All values must be numbers.',
        statusCode: 400,
      });
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
