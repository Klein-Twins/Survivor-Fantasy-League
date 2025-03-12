import { Request } from 'express';
import { ProfileAttributes } from '../../../models/account/Profile';
import { EpisodeAttributes } from '../../../models/season/Episodes';
import { LeagueAttributes } from '../../../models/league/League';
import { validate as validateUUID } from 'uuid';
import { BadRequestError } from '../../../utils/errors/errors';
import { SubmitSurveyRequestBody } from '../../../generated-api';
const surveyHelper = {
  validateAndFormatGetSurveyForLeagueMember,
  validateAndFormatSubmitSurveyRequest,
};

function validateAndFormatSubmitSurveyRequest(
  reqBody: Request['body']
): SubmitSurveyRequestBody {
  const episodeId = reqBody.episodeId;
  if (!episodeId) {
    throw new BadRequestError('episodeId is required');
  }
  if (!validateUUID(episodeId)) {
    throw new BadRequestError('Invalid leagueSurveyId');
  }

  const leagueSurveyId = reqBody.leagueSurveyId;
  if (!leagueSurveyId) {
    throw new BadRequestError('leagueSurveyId is required');
  }
  if (!validateUUID(leagueSurveyId)) {
    throw new BadRequestError('Invalid leagueSurveyId');
  }

  const surveyId = reqBody.surveyId;
  if (!surveyId) {
    throw new BadRequestError('leagueSurveyId is required');
  }
  if (!validateUUID(surveyId)) {
    throw new BadRequestError('Invalid leagueSurveyId');
  }

  const leagueId = reqBody.leagueId;
  if (!leagueId) {
    throw new BadRequestError('leagueSurveyId is required');
  }
  if (!validateUUID(leagueId)) {
    throw new BadRequestError('Invalid leagueSurveyId');
  }

  const profileId = reqBody.profileId;
  if (!profileId) {
    throw new BadRequestError('leagueSurveyId is required');
  }
  if (!validateUUID(profileId)) {
    throw new BadRequestError('Invalid leagueSurveyId');
  }

  const picksChoices = reqBody.pickChoices;
  if (!picksChoices) {
    throw new BadRequestError('pickChoices is required');
  }
  if (!Array.isArray(picksChoices)) {
    throw new BadRequestError('pickChoices must be an array');
  }
  for (const pickSelection of picksChoices) {
    if (pickSelection.pickId === undefined) {
      throw new BadRequestError('pickId is required in all pick selections');
    }
    if (pickSelection.playerChoice === undefined) {
      throw new BadRequestError(
        'playerChoice is required in all pick selections'
      );
    }
    if (!validateUUID(pickSelection.pickId)) {
      throw new BadRequestError('Invalid pickId in pick selection');
    }
  }

  const formattedRequest: SubmitSurveyRequestBody = {
    episodeId,
    leagueSurveyId,
    surveyId,
    leagueId,
    profileId,
    pickChoices: picksChoices,
  };

  return formattedRequest;
}

async function validateAndFormatGetSurveyForLeagueMember({
  leagueId,
  profileId,
  episodeId,
}: any): Promise<{
  leagueId: LeagueAttributes['leagueId'];
  profileId: ProfileAttributes['profileId'];
  episodeId: EpisodeAttributes['episodeId'];
}> {
  if (!leagueId) {
    throw new BadRequestError('leagueId is required');
  }
  if (!validateUUID(leagueId)) {
    throw new BadRequestError('Invalid leagueId');
  }
  if (!profileId) {
    throw new BadRequestError('profileId is required');
  }
  if (!validateUUID(profileId)) {
    throw new BadRequestError('Invalid profileId');
  }
  if (!episodeId) {
    throw new BadRequestError('episodeId is required');
  }
  if (!validateUUID(episodeId)) {
    throw new BadRequestError('Invalid episodeId');
  }

  return {
    leagueId,
    profileId,
    episodeId,
  };
}

export default surveyHelper;
