import { UUID } from 'crypto';
import { models } from '../../../config/db';
import {
  LeagueSurvey,
  Pick,
  SurveyAvailabilityStatusEnum,
  SurveySubmissionStatusEnum,
  SurveyType,
} from '../../../generated-api';
import { ProfileAttributes } from '../../../models/account/Profile';
import { LeagueAttributes } from '../../../models/league/League';
import { LeagueSurveyAttributes } from '../../../models/league/LeagueSurveys';
import { EpisodeAttributes } from '../../../models/season/Episodes';
import { SurveyAttributes } from '../../../models/surveysAndPicks/Survey';
import { SurveyPicksAttributes } from '../../../models/surveysAndPicks/SurveyPicks';
import episodeService from '../../../services/season/episodeService';
import {
  InternalServerError,
  NotFoundError,
} from '../../../utils/errors/errors';
import picksService from '../../../services/league/surveys/picks/picksService';

const surveyRepository = {
  getSurvey,
};

async function getSurvey(
  leagueId: LeagueAttributes['leagueId'],
  profileId: ProfileAttributes['profileId'],
  episodeId: EpisodeAttributes['episodeId'] | string
): Promise<LeagueSurvey> {
  const leagueSurveyAttributes: LeagueSurveyAttributes | null =
    await models.LeagueSurveys.findOne({
      where: {
        leagueId,
        episodeId,
      },
    });

  if (!leagueSurveyAttributes) {
    throw new NotFoundError('League Survey not found');
  }

  const leagueSurveyId = leagueSurveyAttributes.leagueSurveyId;
  const surveyId = leagueSurveyAttributes.surveyId;

  const surveyAttributes: SurveyAttributes | null = await models.Survey.findOne(
    {
      where: {
        surveyId,
      },
    }
  );

  if (!surveyAttributes) {
    throw new NotFoundError('Survey not found');
  }

  const episode = await episodeService.getEpisodes([episodeId]);
  if (!episode || episode.length !== 1) {
    throw new InternalServerError(
      //Todo remove multiple implementations.
      `surveyRepository.getSurvey => ... episodeService.getEpisode(${episodeId}) did not return one episode.`
    );
  }

  //Picks tied to survey
  const surveyPickAttributes: SurveyPicksAttributes[] =
    await models.SurveyPicks.findAll({
      where: {
        surveyId,
      },
    });
  const surveyPickIds: UUID[] = surveyPickAttributes.map(
    (surveyPick) => surveyPick.pickId
  );

  const picks: Pick[] = await Promise.all(
    surveyPickIds.map((pickId) => picksService.getPick(pickId))
  );

  //TODO Consider adding helper function for this.
  const leagueSurvey: LeagueSurvey = {
    leagueSurveyId: leagueSurveyId,
    surveyId: surveyId,
    episode: episode[0],
    picks: picks,
    surveyType:
      episode[0].episodeNumber === 0 ? SurveyType.Premier : SurveyType.Weekly,
    surveyAvailabilityStatus: SurveyAvailabilityStatusEnum.Available,
    surveySubmissionStatus: SurveySubmissionStatusEnum.InProgress,
  };
  return leagueSurvey;
}

export default surveyRepository;
