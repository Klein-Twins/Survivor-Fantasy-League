import { models } from '../../../config/db';
import {
  CompletedLeagueSurvey,
  Episode,
  League,
  LeagueMember,
  LeagueSurvey,
  SubmitSurveyRequestBody,
} from '../../../generated-api';
import leagueMemberHelper from '../../../helpers/league/leagueMemberHelper';
import { ProfileAttributes } from '../../../models/account/Profile';
import { LeagueAttributes } from '../../../models/league/League';
import { EpisodeAttributes } from '../../../models/season/Episodes';
import { SurveyAttributes } from '../../../models/surveyAndPick/Survey';
import picksRepository from '../../../repositories/league/surveys/picks/picksRepository';
import surveyRepository from '../../../repositories/league/surveys/surveyRepository';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  NotImplementedError,
} from '../../../utils/errors/errors';
import episodeService from '../../season/episodeService';
import leagueMemberService from '../leagueMemberService';
import leagueService from '../leagueService';
import logger from '../../../config/logger';
import leagueMemberRepository from '../../../repositories/league/leagueMemberRepository';
import { UUID } from 'crypto';

const surveyService = {
  getLeagueSurvey,
  submitSurvey,
  getCurrentEpisodeSurveys,
};

async function getCurrentEpisodeSurveys(
  profileId: ProfileAttributes['profileId'],
  leagueIds: LeagueAttributes['leagueId'][]
): Promise<LeagueSurvey[]> {
  const leagueSurveys: LeagueSurvey[] = [];
  for (const leagueId of leagueIds) {
    const leagueMember: LeagueMember =
      await leagueMemberService.getLeagueProfile(leagueId, profileId);
    const outstandingAvailableSurvey: LeagueSurvey | null =
      await surveyRepository.getCurrentEpisodeSurvey(
        leagueMember.leagueProfileId
      );
    if (outstandingAvailableSurvey) {
      leagueSurveys.push(outstandingAvailableSurvey);
    }
  }
  return leagueSurveys;
}

async function submitSurvey(
  submitSurveyRequest: SubmitSurveyRequestBody
): Promise<CompletedLeagueSurvey> {
  const episodeId = submitSurveyRequest.episodeId;
  const leagueSurveyId = submitSurveyRequest.leagueSurveyId;
  const surveyId = submitSurveyRequest.surveyId;
  const leagueId = submitSurveyRequest.leagueId;
  const profileId = submitSurveyRequest.profileId;
  const pickChoices = submitSurveyRequest.pickChoices;

  const leagueMember: LeagueMember = await leagueMemberService.getLeagueProfile(
    leagueId,
    profileId
  );
  const leagueSurvey: LeagueSurvey | CompletedLeagueSurvey =
    await getLeagueSurvey(leagueId, profileId, episodeId);
  if ((leagueSurvey as CompletedLeagueSurvey).pickSelections !== undefined) {
    throw new ConflictError('Survey has already been submitted');
  }

  await surveyRepository.submitSurvey(
    pickChoices,
    leagueMember.leagueProfileId,
    leagueSurvey.leagueSurveyId as UUID
  );

  return (await getLeagueSurvey(
    leagueId,
    profileId,
    episodeId
  )) as CompletedLeagueSurvey;
}
async function getLeagueSurvey(
  leagueId: LeagueAttributes['leagueId'],
  profileId: ProfileAttributes['profileId'],
  episodeId: EpisodeAttributes['episodeId']
): Promise<LeagueSurvey | CompletedLeagueSurvey> {
  const leagueMember: LeagueMember = await leagueMemberService.getLeagueProfile(
    leagueId,
    profileId
  );

  const isSubmitted = await surveyRepository.isLeagueSurveySubmitted(
    leagueMember.leagueProfileId,
    episodeId
  );

  const leagueSurvey: CompletedLeagueSurvey | LeagueSurvey = isSubmitted
    ? await surveyRepository.getCompletedLeagueSurvey(
        leagueMember.leagueProfileId,
        episodeId
      )
    : await surveyRepository.getLeagueSurvey(
        episodeId,
        leagueMember.leagueProfileId
      );

  return leagueSurvey;
}

export default surveyService;
