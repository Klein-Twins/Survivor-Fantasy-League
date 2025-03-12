import { UUID } from 'crypto';
import { models } from '../../../config/db';
import {
  CompletedLeagueSurvey,
  League,
  LeagueSurvey,
  Pick,
  PickSelection,
  Survey,
  SurveyAvailabilityStatus,
} from '../../../generated-api';
import { LeagueSurveyAttributes } from '../../../models/league/LeagueSurveys';
import { EpisodeAttributes } from '../../../models/season/Episodes';
import { SurveyAttributes } from '../../../models/surveysAndPicks/Survey';
import episodeService from '../../../services/season/episodeService';
import { NotFoundError } from '../../../utils/errors/errors';
import { LeagueProfileAttributes } from '../../../models/league/LeagueProfile';
import { PicksAttributes } from '../../../models/surveysAndPicks/picks/Picks';

import { v4 as uuidv4 } from 'uuid';
import { PickSubmissionAttributes } from '../../../models/league/PickSubmission';
import picksRepository from './picks/picksRepository';
import leagueRepository from '../leagueRepository';
import { ProfileAttributes } from '../../../models/account/Profile';
import profileRepository from '../../profile/profileRepository';

const surveyRepository = {
  getSurvey,
  getLeagueSurvey,
  submitSurvey,
  isLeagueSurveySubmitted,
  getCompletedLeagueSurvey,
};

async function getSurvey(
  surveyId: SurveyAttributes['surveyId']
): Promise<Survey> {
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

  const picks: Pick[] = await picksRepository.getPicksForSurveyId(surveyId);

  return {
    id: surveyAttributes.surveyId,
    picks: picks,
  };
}

async function isLeagueSurveySubmitted(
  leagueProfileId: LeagueProfileAttributes['id'],
  episodeId: EpisodeAttributes['episodeId']
): Promise<boolean> {
  const leagueSurveyAttributes: LeagueSurveyAttributes | null =
    await models.LeagueSurveys.findOne({
      where: {
        episodeId,
      },
    });
  if (!leagueSurveyAttributes) {
    throw new NotFoundError(
      'League Survey not found for episodeId ' + episodeId
    );
  }

  const surveySubmissionAttributes = await models.SurveySubmissions.findOne({
    where: {
      leagueProfileId,
      leagueSurveyId: leagueSurveyAttributes.leagueSurveyId,
    },
  });

  return !!surveySubmissionAttributes;
}

async function getCompletedLeagueSurvey(
  leagueProfileId: LeagueProfileAttributes['id'],
  episodeId: EpisodeAttributes['episodeId']
): Promise<CompletedLeagueSurvey> {
  const leagueSurveyAttributes: LeagueSurveyAttributes | null =
    await models.LeagueSurveys.findOne({
      where: {
        episodeId,
      },
    });

  if (!leagueSurveyAttributes) {
    throw new NotFoundError(
      'League Survey not found for episodeId ' + episodeId
    );
  }

  const surveySubmissionAttributes = await models.SurveySubmissions.findOne({
    where: {
      leagueProfileId,
      leagueSurveyId: leagueSurveyAttributes.leagueSurveyId,
    },
  });

  if (!surveySubmissionAttributes) {
    throw new NotFoundError(
      'Survey Submission not found for leagueProfileId ' +
        leagueProfileId +
        ' and episodeId ' +
        episodeId
    );
  }

  const leagueSurvey: LeagueSurvey = await getLeagueSurvey(episodeId);

  const league: League = await leagueRepository.getLeagueByLeagueProfileId(
    leagueProfileId
  );

  const pickSelections: PickSelection[] =
    await picksRepository.getPickSelections(
      surveySubmissionAttributes.surveySubmissionId
    );

  const profileId: ProfileAttributes['profileId'] =
    await profileRepository.getProfileIdByLeagueProfileId(leagueProfileId);

  return {
    ...leagueSurvey,
    pickSelections,
    leagueId: league.leagueId,
    profileId,
  };
}

async function getLeagueSurvey(
  episodeId: EpisodeAttributes['episodeId']
): Promise<LeagueSurvey> {
  const leagueSurveyAttributes: LeagueSurveyAttributes | null =
    await models.LeagueSurveys.findOne({
      where: {
        episodeId,
      },
    });
  if (!leagueSurveyAttributes) {
    throw new NotFoundError(
      'League Survey not found for episodeId ' + episodeId
    );
  }

  const survey: Survey = await surveyRepository.getSurvey(
    leagueSurveyAttributes.surveyId
  );
  const leagueSurvey: LeagueSurvey = {
    ...survey,
    episode: await episodeService.getEpisodeByEpisodeId(episodeId),
    leagueSurveyId: leagueSurveyAttributes.leagueSurveyId,
    availabilityStatus: SurveyAvailabilityStatus.Available,
  };
  return leagueSurvey;
}

// const leagueSurveyAttributes: LeagueSurveyAttributes | null =
//   await models.LeagueSurveys.findOne({
//     where: {
//       leagueId,
//       episodeId,
//     },
//   });

// if (!leagueSurveyAttributes) {
//   throw new NotFoundError('League Survey not found');
// }

// const leagueSurveyId = leagueSurveyAttributes.leagueSurveyId;
// const surveyId = leagueSurveyAttributes.surveyId;

// const surveyAttributes: SurveyAttributes | null = await models.Survey.findOne(
//   {
//     where: {
//       surveyId,
//     },
//   }
// );

// if (!surveyAttributes) {
//   throw new NotFoundError('Survey not found');
// }

// const episode = await episodeService.getEpisodes([episodeId]);
// if (!episode || episode.length !== 1) {
//   throw new InternalServerError(
//     //Todo remove multiple implementations.
//     `surveyRepository.getSurvey => ... episodeService.getEpisode(${episodeId}) did not return one episode.`
//   );
// }

// //Picks tied to survey
// const surveyPickAttributes: SurveyPicksAttributes[] =
//   await models.SurveyPicks.findAll({
//     where: {
//       surveyId,
//     },
//   });
// const surveyPickIds: UUID[] = surveyPickAttributes.map(
//   (surveyPick) => surveyPick.pickId
// );

// const picks: Pick[] = await Promise.all(
//   surveyPickIds.map((pickId) => picksService.getPick(pickId))
// );

// //TODO Consider adding helper function for this.
// const leagueSurvey: LeagueSurvey = {
//   leagueSurveyId: leagueSurveyId,
//   surveyId: surveyId,
//   episode: episode[0],
//   picks: picks,
//   surveyType:
//     episode[0].episodeNumber === 0 ? SurveyType.Premier : SurveyType.Weekly,
//   surveyAvailabilityStatus: SurveyAvailabilityStatusEnum.Available,
//   surveySubmissionStatus: SurveySubmissionStatusEnum.InProgress,
// };
// return leagueSurvey;

async function submitSurvey(
  pickSelections: PickSelection[],
  leagueProfileId: LeagueProfileAttributes['leagueId'],
  leagueSurveyId: LeagueSurveyAttributes['leagueSurveyId']
): Promise<PickSubmissionAttributes[]> {
  const transaction = await models.sequelize.transaction();
  try {
    const surveySubmissionId: UUID = uuidv4() as UUID;

    const surveySubmissionAttributes = await models.SurveySubmissions.create(
      {
        surveySubmissionId,
        leagueProfileId,
        leagueSurveyId,
      },
      { transaction }
    );

    const pickSubmissionAttributes = await picksRepository.submitPicks(
      surveySubmissionId,
      pickSelections,
      transaction
    );

    await transaction.commit();
    return pickSubmissionAttributes;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export default surveyRepository;
