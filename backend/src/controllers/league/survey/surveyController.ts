import { NextFunction, Request, Response } from 'express';
import {
  GetLeagueMemberSurveyResponse,
  GetLeagueMemberSurveyResponseData,
  GetLeagueMemberSurveysResponse,
  GetLeagueMemberSurveysResponseData,
  PickIdAndPlayerChoice,
  SubmitSurveyRequestBody,
  SubmitSurveyResponse,
  SurveySubmissionStatus,
} from '../../../generated-api';
import { LeagueAttributes } from '../../../models/league/League';
import { ProfileAttributes } from '../../../models/account/Profile';

import validator from 'validator';
import leagueMemberSurveyService from '../../../services/league/survey/leagueMemberSurveyService';
import { BadRequestError } from '../../../utils/errors/errors';

import { UUID } from 'crypto';
import pickService from '../../../services/league/survey/pickService';
import logger from '../../../config/logger';

const surveyController = {
  getSurveyForLeagueMember,
  getSurveysForLeagueMember,
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

async function getSurveysForLeagueMember(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let response: GetLeagueMemberSurveysResponse;
  try {
    const { leagueId, profileId } = req.params;
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

    const leagueMemberSurveys =
      await leagueMemberSurveyService.getLeagueMemberSurveys(
        leagueId as UUID,
        profileId as UUID
      );

    logger.debug('Sending ' + leagueMemberSurveys.length + ' surveys');

    const responseData: GetLeagueMemberSurveysResponseData =
      leagueMemberSurveys;

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
    const submitSurveyRequest = validateSubmitSurveyRequest(requestBody);

    const completedLeagueMemberSurvey =
      await leagueMemberSurveyService.submitLeagueSurvey({
        surveyId: submitSurveyRequest.surveyId as UUID,
        leagueId: submitSurveyRequest.leagueId,
        leagueProfileId: submitSurveyRequest.leagueProfileId as UUID,
        episodeId: submitSurveyRequest.episodeId as UUID,
        leagueSurveyId: submitSurveyRequest.leagueSurveyId as UUID,
        picksWithChoice: submitSurveyRequest.picksWithChoice,
      });

    const response: SubmitSurveyResponse = {
      success: true,
      message: 'Successfully submitted survey',
      statusCode: 200,
      responseData: {
        leagueSurvey: completedLeagueMemberSurvey,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

function validateSubmitSurveyRequest(reqBody: any): SubmitSurveyRequestBody {
  //profileId is actually leagueSurveyId
  const {
    episodeId,
    leagueId,
    leagueSurveyId,
    surveyId,
    leagueProfileId,
    picksWithChoice,
  } = reqBody;

  if (!leagueId) {
    throw new BadRequestError('LeagueId is required');
  }
  if (!validator.isUUID(leagueId)) {
    throw new BadRequestError('Invalid leagueId');
  }
  if (!validator.isUUID(episodeId)) {
    throw new BadRequestError('Invalid episodeId');
  }
  if (!validator.isUUID(leagueSurveyId)) {
    throw new BadRequestError('Invalid leagueSurveyId');
  }
  if (!validator.isUUID(surveyId)) {
    throw new BadRequestError('Invalid surveyId');
  }
  if (!validator.isUUID(leagueProfileId)) {
    throw new BadRequestError('Invalid profileId');
  }
  if (!Array.isArray(picksWithChoice)) {
    throw new BadRequestError('Picks must be an array');
  }
  picksWithChoice.forEach((pick: PickIdAndPlayerChoice) => {
    if (!pick.pickId) {
      throw new BadRequestError('Pick ID is required');
    }
    if (!pick.choice) {
      throw new BadRequestError('Pick choices are required');
    }
    if (!Array.isArray(pick.choice)) {
      throw new BadRequestError('Pick choices must be an array');
    }
    if (pick.choice.length === 0) {
      throw new BadRequestError('Pick choices cannot be empty');
    }
    pick.choice.forEach((choice: string) => {
      if (!choice) {
        throw new BadRequestError('Choice ID is required');
      }
      if (!validator.isUUID(choice)) {
        throw new BadRequestError('Invalid choice ID');
      }
    });
  });

  const convertedTypePicks: PickIdAndPlayerChoice[] = picksWithChoice.map(
    (pick: any) => {
      return {
        pickId: pick.pickId as UUID,
        choice: pick.choice.map((choice: any) => choice as UUID) as UUID[],
      };
    }
  );

  return {
    episodeId: episodeId as UUID,
    leagueSurveyId: leagueSurveyId as UUID,
    surveyId: surveyId as UUID,
    leagueProfileId: leagueProfileId as UUID,
    leagueId: leagueId as UUID,
    picksWithChoice: convertedTypePicks,
  };
}

export default surveyController;
