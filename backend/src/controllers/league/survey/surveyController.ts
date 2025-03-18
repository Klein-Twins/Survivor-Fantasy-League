import { NextFunction, Request, Response } from 'express';
import {
  CompletedLeagueMemberSurvey,
  GetLeagueMemberSurveyResponse,
  GetLeagueMemberSurveyResponseData,
  SubmitSurveyRequestBody,
  SurveySubmissionStatus,
} from '../../../generated-api';
import { LeagueAttributes } from '../../../models/league/League';
import { ProfileAttributes } from '../../../models/account/Profile';

import validator from 'validator';
import surveyService from '../../../services/league/survey/surveyService';
import leagueMemberSurveyService from '../../../services/league/survey/leagueMemberSurveyService';
import { BadRequestError } from '../../../utils/errors/errors';
import { UUID } from 'crypto';

const surveyController = {
  getSurveyForLeagueMember,
  submitSurvey,
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

async function getSurveyForLeagueMember(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let response: GetLeagueMemberSurveyResponse;
  try {
    const { leagueId, profileId, episodeId } = req.params;
    if (!leagueId) {
      throw new BadRequestError('LeagueId is required');
    }
    if (!validator.isUUID(leagueId)) {
      throw new BadRequestError('Invalid leagueId');
    }
    if (!profileId) {
      throw new BadRequestError('ProfileId is required');
    }
    if (!validator.isUUID(profileId)) {
      throw new BadRequestError('Invalid profileId');
    }
    if (!episodeId) {
      throw new BadRequestError('EpisodeId is required');
    }
    if (!validator.isUUID(episodeId)) {
      throw new BadRequestError('Invalid episodeId');
    }

    const leagueSurvey = await leagueMemberSurveyService.getLeagueMemberSurvey(
      leagueId as UUID,
      profileId as UUID,
      episodeId as UUID
    );

    const isCompleted: boolean =
      leagueSurvey.submissionStatus === SurveySubmissionStatus.Submitted;
    const responseData: GetLeagueMemberSurveyResponseData = {
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
    //await leagueMemberSurveyService.submitSurvey(submitSurveyRequest);
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
