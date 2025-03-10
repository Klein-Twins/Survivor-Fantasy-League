import { NextFunction, Request, Response } from 'express';
import surveyHelper from '../../../helpers/league/surveys/surveyHelper';
import {
  GetSurveyForEpisodeForLeagueMember,
  GetSurveyForEpisodeForLeagueMemberResponseData,
} from '../../../generated-api';
import surveyService from '../../../services/league/surveys/surveyService';

const surveyController = {
  getSurveyForLeagueMember,
};

async function getSurveyForLeagueMember(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let response: GetSurveyForEpisodeForLeagueMember;
  try {
    const { leagueId, profileIds, episodeIds } =
      await surveyHelper.validateAndFormatGetSurveyForLeagueMember(req);
    const responseData: GetSurveyForEpisodeForLeagueMemberResponseData =
      await surveyService.getSurveys(leagueId, profileIds, episodeIds);
    response = {
      success: true,
      message: 'Successfully retrieved league surveys',
      statusCode: 200,
      responseData: responseData,
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

export default surveyController;
