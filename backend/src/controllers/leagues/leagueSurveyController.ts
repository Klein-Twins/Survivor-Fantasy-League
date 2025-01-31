import { NextFunction, Request, Response } from 'express';
import picksService from '../../servicesAndHelpers/picks/picksService';
import surveyService from '../../servicesAndHelpers/leagues/surveyService';
import {
  GetSurveyForEpisodeForLeagueMember,
  GetSurveyForEpisodeForLeagueMemberResponseData,
  LeagueSurvey,
  SurveyType,
} from '../../generated-api';

async function getSurveyForLeagueMember(req: Request, res: Response, next: NextFunction) {
  try {
    const leagueId = req.params.leagueId;
    const profileIds = Array.isArray(req.query.profileId)
      ? (req.query.profileId as string[])
      : req.query.profileId
      ? [req.query.profileId as string]
      : [];
    const episodeIds = Array.isArray(req.query.episodeId)
      ? (req.query.episodeId as string[])
      : req.query.episodeId
      ? [req.query.episodeId as string]
      : [];

    const leagueSurveys: LeagueSurvey[] = await surveyService.getSurveys(leagueId, profileIds, episodeIds);

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
