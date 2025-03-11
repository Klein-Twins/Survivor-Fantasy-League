import { NextFunction, Request, Response } from 'express';
import surveyHelper from '../../../helpers/league/surveys/surveyHelper';
import {
  GetSurveyForEpisodeForLeagueMember,
  GetSurveyForEpisodeForLeagueMemberResponseData,
  SubmitSurveyWithPickChoicesRequestBody,
} from '../../../generated-api';
import surveyService from '../../../services/league/surveys/surveyService';

const surveyController = {
  getSurveyForLeagueMember,
  submitSurvey,
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

async function submitSurvey(req: Request, res: Response, next: NextFunction) {
  try {
    const requestBody: any = req.body;
    const submitSurveyRequest: SubmitSurveyWithPickChoicesRequestBody =
      await surveyHelper.validateAndFormatSubmitSurveyRequest(requestBody);
    await surveyService.submitSurvey(submitSurveyRequest);
  } catch (error) {
    next(error);
  }
}

export default surveyController;
