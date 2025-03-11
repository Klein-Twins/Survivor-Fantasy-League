import { Request } from 'express';
import { ProfileAttributes } from '../../../models/account/Profile';
import { EpisodeAttributes } from '../../../models/season/Episodes';
import { LeagueAttributes } from '../../../models/league/League';
import leagueHelper from '../leagueHelper';
import profileHelper from '../../auth/profileHelper';
import episodeHelper from '../../season/episodeHelper';
import { SubmitSurveyWithPickChoicesRequestBody } from '../../../generated-api';
import { validate } from 'uuid';
import { BadRequestError } from '../../../utils/errors/errors';
const surveyHelper = {
  validateAndFormatGetSurveyForLeagueMember,
  validateAndFormatSubmitSurveyRequest,
};

function validateAndFormatSubmitSurveyRequest(
  reqBody: any
): SubmitSurveyWithPickChoicesRequestBody {
  const episodeId = reqBody.episodeId;
  if (!episodeId) {
    throw new BadRequestError('episodeId is required');
  }
  if (!validate(episodeId)) {
    throw new BadRequestError('Invalid leagueSurveyId');
  }

  const leagueSurveyId = reqBody.leagueSurveyId;
  if (!leagueSurveyId) {
    throw new BadRequestError('leagueSurveyId is required');
  }
  if (!validate(leagueSurveyId)) {
    throw new BadRequestError('Invalid leagueSurveyId');
  }

  const surveyId = reqBody.surveyId;
  if (!surveyId) {
    throw new BadRequestError('leagueSurveyId is required');
  }
  if (!validate(surveyId)) {
    throw new BadRequestError('Invalid leagueSurveyId');
  }

  const leagueId = reqBody.leagueId;
  if (!leagueId) {
    throw new BadRequestError('leagueSurveyId is required');
  }
  if (!validate(leagueId)) {
    throw new BadRequestError('Invalid leagueSurveyId');
  }

  const profileId = reqBody.profileId;
  if (!profileId) {
    throw new BadRequestError('leagueSurveyId is required');
  }
  if (!validate(profileId)) {
    throw new BadRequestError('Invalid leagueSurveyId');
  }

  const picksChoices = reqBody.pickChoices;
  if (!picksChoices) {
    throw new BadRequestError('pickChoices is required');
  }
  if (!Array.isArray(picksChoices)) {
    throw new BadRequestError('pickChoices must be an array');
  }
  if (picksChoices.length === 0) {
    throw new BadRequestError('pickChoices must not be empty');
  }

  picksChoices.map((pickChoices) => {
    if (!pickChoices.pick || !pickChoices.pick.id) {
      throw new BadRequestError('pick is required');
    }
    if (!validate(pickChoices.pick.id)) {
      throw new BadRequestError('Invalid pickId');
    }
    if (!pickChoices.playerChoice) {
      throw new BadRequestError('playerChoice is required');
    }
  });

  const formattedRequest: SubmitSurveyWithPickChoicesRequestBody = {
    episodeId,
    leagueSurveyId,
    surveyId,
    leagueId,
    profileId,
    pickChoices: picksChoices,
  };

  return formattedRequest;
}

async function validateAndFormatGetSurveyForLeagueMember(
  req: Request
): Promise<{
  leagueId: LeagueAttributes['leagueId'];
  profileIds: ProfileAttributes['profileId'][];
  episodeIds: EpisodeAttributes['episodeId'][];
}> {
  const leagueId = req.params.leagueId;
  leagueHelper.validateLeagueId(leagueId);

  const profileIds = Array.isArray(req.query.profileId)
    ? (req.query.profileId as string[])
    : req.query.profileId
    ? [req.query.profileId as string]
    : [];
  await profileHelper.validateProfileIds(profileIds);

  const episodeIds = Array.isArray(req.query.episodeId)
    ? (req.query.episodeId as string[]).map(String)
    : req.query.episodeId
    ? [String(req.query.episodeId)]
    : [];
  await episodeHelper.validateEpisodeIds(episodeIds);

  return {
    leagueId,
    profileIds,
    episodeIds,
  };
}

export default surveyHelper;
