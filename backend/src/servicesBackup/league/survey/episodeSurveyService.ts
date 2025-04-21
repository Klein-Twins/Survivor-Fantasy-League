import { Transaction } from 'sequelize';
import { EpisodeAttributes } from '../../../models/season/Episodes';
import episodeSurveyRepository from '../../../repositoriesBackup/league/survey/episodeSurveyRepository';
import { EpisodeSurveyAttributes } from '../../../models/surveyAndPick/EpisodeSurvey';
import {
  EpisodeSurvey,
  Survey,
  SurveyAvailabilityStatus,
} from '../../../generated-api';
import surveyService from './surveyService';
import { NotFoundError } from '../../../utils/errors/errors';

const episodeSurveyService = {
  getEpisodeSurvey,
};

async function getEpisodeSurvey(
  episodeId: EpisodeAttributes['id'],
  transaction?: Transaction
): Promise<EpisodeSurvey> {
  const episodeSurveyAttributes =
    await episodeSurveyRepository.getEpisodeSurvey(episodeId, transaction);
  if (!episodeSurveyAttributes) {
    throw new NotFoundError(
      `Episode survey not found for episodeId: ${episodeId}`
    );
  }
  const survey = await surveyService.getSurveyDefinition(
    episodeSurveyAttributes.surveyDefinition,
    episodeId
  );
  return buildEpisodeSurvey(episodeSurveyAttributes, survey);
}

function buildEpisodeSurvey(
  episodeSurveyAttributes: EpisodeSurveyAttributes,
  survey: Survey
): EpisodeSurvey {
  const currentDateTime = new Date(Date.now());
  const surveyAvailabilityStatus: SurveyAvailabilityStatus =
    currentDateTime < episodeSurveyAttributes.openDate
      ? SurveyAvailabilityStatus.NotOpenYet
      : currentDateTime > episodeSurveyAttributes.dueDate
      ? SurveyAvailabilityStatus.Closed
      : SurveyAvailabilityStatus.Available;

  return {
    episodeId: episodeSurveyAttributes.episodeId,
    dueDate: episodeSurveyAttributes.dueDate,
    openDate: episodeSurveyAttributes.openDate,
    episodeSurveyId: episodeSurveyAttributes.episodeSurveyId,
    surveyAvailabilityStatus,
    ...survey,
  };
}

export default episodeSurveyService;
