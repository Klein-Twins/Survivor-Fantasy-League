import { UUID } from 'crypto';
import { models } from '../../../config/db';
import {
  Episode,
  GetSurveyForEpisodeForLeagueMemberResponseData,
  League,
  LeagueSurvey,
  PickOptionTypeEnum,
  SubmitSurveyWithPickChoicesRequestBody,
} from '../../../generated-api';
import leagueMemberHelper from '../../../helpers/league/leagueMemberHelper';
import surveyHelper from '../../../helpers/league/surveys/surveyHelper';
import { ProfileAttributes } from '../../../models/account/Profile';
import { LeagueAttributes } from '../../../models/league/League';
import { EpisodeAttributes } from '../../../models/season/Episodes';
import { SurveyAttributes } from '../../../models/surveysAndPicks/Survey';
import picksRepository from '../../../repositories/league/surveys/picks/picksRepository';
import surveyRepository from '../../../repositories/league/surveys/surveyRepository';
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from '../../../utils/errors/errors';
import episodeService from '../../season/episodeService';
import leagueMemberService from '../leagueMemberService';
import leagueService from '../leagueService';
import logger from '../../../config/logger';

const surveyService = {
  getSurveys,
  submitSurvey,
};

async function submitSurvey(
  submitSurveyRequest: SubmitSurveyWithPickChoicesRequestBody
): Promise<void> {
  await leagueMemberHelper.validateProfileIsInLeague(
    submitSurveyRequest.leagueId,
    submitSurveyRequest.profileId
  );
  const episodes = await episodeService.getEpisodes([
    submitSurveyRequest.episodeId,
  ]);
  if (episodes.length === 0) {
    throw new NotFoundError('Episode not found');
  } else if (episodes.length > 1) {
    throw new InternalServerError('Multiple episodes found');
  }
  const episode = episodes[0];

  const leagueProfile = leagueMemberService.getLeagueProfile(
    submitSurveyRequest.leagueId,
    submitSurveyRequest.profileId
  );
  if (!leagueProfile) {
    throw new NotFoundError('League profile not found');
  }

  const surveyAttributes: SurveyAttributes | null = await models.Survey.findOne(
    {
      where: {
        surveyId: submitSurveyRequest.surveyId,
      },
    }
  );
  if (!surveyAttributes) {
    throw new NotFoundError('Survey Id not found');
  }

  await Promise.all(
    submitSurveyRequest.pickChoices.map(async (pickChoice) => {
      const isValid: boolean = await picksRepository.validatePickInSurvey(
        submitSurveyRequest.surveyId as SurveyAttributes['surveyId'],
        pickChoice.pick.id
      );
      if (!isValid) {
        logger.error(
          `Pick id ${pickChoice.pick.id} not found in survey with id ${submitSurveyRequest.surveyId}`
        );
        throw new BadRequestError('Pick does not belong to survey');
      }
    })
  );

  await Promise.all(
    submitSurveyRequest.pickChoices.map(async (pickChoice) => {
      const isValid: boolean = await picksRepository.validatePickChoice(
        pickChoice
      );
      if (!isValid) {
        logger.error(
          `Invalid pick choice for pick id ${pickChoice.pick.id} and player choice ${pickChoice.playerChoice}`
        );
        logger.error(
          `Expected of type ${pickChoice.pick.pickOptionType} but got ${pickChoice.playerChoice}`
        );
        throw new BadRequestError('Invalid pick choice');
      }
    })
  );
}

async function getSurveys(
  leagueId: LeagueAttributes['leagueId'],
  profileIds: ProfileAttributes['profileId'][],
  episodeIds: EpisodeAttributes['episodeId'][]
): Promise<GetSurveyForEpisodeForLeagueMemberResponseData> {
  const league: League = await leagueService.getLeague(leagueId);

  profileIds.map(async (profileId) => {
    await leagueMemberHelper.validateProfileIsInLeague(leagueId, profileId);
  });

  const seasonId = league.season.id;

  const episodes: Episode[] = await episodeService.getEpisodes(episodeIds);

  let surveys: LeagueSurvey[] = [];
  for (const profileId of profileIds) {
    for (const episode of episodes) {
      surveys = surveys.concat(
        await surveyRepository.getSurvey(leagueId, profileId, episode.id)
      );
    }
  }

  return { leagueSurveys: surveys };
}

export default surveyService;
