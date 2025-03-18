import { NextFunction, Request, Response } from 'express';
import surveyHelper from '../../../helpers/league/surveys/surveyHelper';
import surveyService from '../../../servicesBackups/league/surveys/surveyService';
import {
  CompletedLeagueSurvey,
  GetCurrentEpisodSurveysResponse,
  GetCurrentEpisodSurveysResponseData,
  GetLeagueSurveyResponse,
  GetLeagueSurveyResponseData,
  SubmitSurveyRequestBody,
} from '../../../generated-api';
import { LeagueAttributes } from '../../../models/league/League';
import { ProfileAttributes } from '../../../models/account/Profile';

const surveyController = {
  getSurveyForLeagueMember,
  submitSurvey,
  getOutstandingSurveysForProfile,
};

export interface GetSurveyRequestParams {
  leagueId: string;
  episodeId: string;
  profileId: string;
}

export interface GetOustandingOpenSurveysRequestParams {
  profileId: ProfileAttributes['profileId'];
  leagueIds: LeagueAttributes['leagueId'][];
}

async function getOutstandingSurveysForProfile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { profileId, leagueIds } =
      surveyHelper.validateAndFormatGetOutstandingSurveyRequest(req);

    const currentEpisodeLeagueSurveys =
      await surveyService.getCurrentEpisodeSurveys(profileId, leagueIds);

    const responseData: GetCurrentEpisodSurveysResponseData = {
      leagueSurveys: currentEpisodeLeagueSurveys,
    };

    const response: GetCurrentEpisodSurveysResponse = {
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

async function getSurveyForLeagueMember(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let response: GetLeagueSurveyResponse;
  try {
    const { leagueId, profileId, episodeId } =
      await surveyHelper.validateAndFormatGetSurveyForLeagueMember(req.params);

    const leagueSurvey = await surveyService.getLeagueSurvey(
      leagueId,
      profileId,
      episodeId
    );

    const isCompleted: boolean =
      (leagueSurvey as CompletedLeagueSurvey).pickSelections !== undefined;
    const responseData: GetLeagueSurveyResponseData = {
      leagueSurvey: leagueSurvey,
      isCompleted: isCompleted,
    };
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
    const submitSurveyRequest: SubmitSurveyRequestBody =
      await surveyHelper.validateAndFormatSubmitSurveyRequest(requestBody);
    await surveyService.submitSurvey(submitSurveyRequest);
    res.status(200).json({
      success: true,
      message: 'Successfully submitted survey',
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
}

export default surveyController;
