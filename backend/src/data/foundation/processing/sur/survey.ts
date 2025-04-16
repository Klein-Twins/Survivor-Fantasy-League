import { UUID } from 'crypto';
import { models } from '../../../../config/db';
import logger from '../../../../config/logger';
import { EpisodeSurveyAttributes } from '../../../../models/surveyAndPick/EpisodeSurvey';
import { SurveyAttributes } from '../../../../models/surveyAndPick/Survey';
import defaultSurveysData from '../../data/surveysAndPicks/surveyData/defaultSurveysData';
import { v4 as uuidv4 } from 'uuid';
import { EpisodeAttributes } from '../../../../models/season/Episodes';

const surveyProcessor = {
  processSurveyDefinitions,
  processEpisodeSurveys,
  processEpisodeSurvey,
};

export default surveyProcessor;

async function processSurveyDefinitions() {
  logger.debug(`Processing survey definitions`);
  for (const surveyDefinition of defaultSurveysData.values()) {
    await seedSurveyTable(surveyDefinition);
  }
  logger.debug(`Finished processing survey definitions`);
}

async function seedSurveyTable(surveyDefinition: SurveyAttributes) {
  logger.debug(`${models.Survey.tableName}: Creating survey definition`);
  await models.Survey.create({
    surveyId: surveyDefinition.surveyId,
    name: surveyDefinition.name,
  });
  logger.debug(`${models.Survey.tableName}: Created survey definition`);
}

async function processEpisodeSurvey(episodeId: EpisodeAttributes['id']) {
  logger.debug(`Processing episode survey for episode Id ${episodeId}...`);

  const episode = await models.Episode.findByPk(episodeId);
  if (!episode) {
    throw new Error(`Episode with ID ${episodeId} not found`);
  }

  const surveyDefinition = defaultSurveysData.get(episode.type);
  if (!surveyDefinition) {
    throw new Error(
      'Survey definition not found for episode type: ' + episode.type
    );
  }

  const dueDate = new Date(episode.airDate);
  const openDate = new Date(dueDate);
  openDate.setDate(dueDate.getDate() - 7);
  await seedEpisodeSurveyTable({
    surveyDefinition: surveyDefinition.surveyId,
    episodeSurveyId: uuidv4() as UUID,
    episodeId: episode.id,
    dueDate: dueDate,
    openDate: openDate,
  });
  logger.debug(`Finished processing episode surveys.`);
}

async function processEpisodeSurveys() {
  logger.debug(`Processing episode surveys...`);

  const allEpisodes = await models.Episode.findAll();

  for (const episode of allEpisodes) {
    const surveyDefinition = defaultSurveysData.get(episode.type);
    if (!surveyDefinition) {
      throw new Error(
        'Survey definition not found for episode type: ' + episode.type
      );
    }

    const dueDate = new Date(episode.airDate);
    const openDate = new Date(dueDate);
    openDate.setDate(dueDate.getDate() - 7);
    await seedEpisodeSurveyTable({
      surveyDefinition: surveyDefinition.surveyId,
      episodeSurveyId: uuidv4() as UUID,
      episodeId: episode.id,
      dueDate: dueDate,
      openDate: openDate,
    });
  }
  logger.debug(`Finished processing episode surveys.`);
}

async function seedEpisodeSurveyTable(episodeSurvey: EpisodeSurveyAttributes) {
  logger.debug(`${models.EpisodeSurvey.tableName}: Creating episode survey`);
  await models.EpisodeSurvey.create(episodeSurvey);
  logger.debug(`${models.EpisodeSurvey.tableName}: Created episode survey`);
}
