import { models } from '../../../../config/db';
import logger from '../../../../config/logger';
import { EpisodeType } from '../../../../generated-api';
import { PickData } from '../../data/surveysAndPicks/pickData/picksData';
import defaultSurveysData from '../../data/surveysAndPicks/surveyData/defaultSurveysData';

const pickProcessor = {
  processPicks,
};

async function processPicks(pickData: PickData[]) {
  logger.debug(`Processing picks...`);

  logger.debug(`Deleting existing picks...`);
  const numDeleted = await models.Picks.destroy({ where: {} });
  logger.debug(`Deleted ${numDeleted} picks.`);

  for (const pick of pickData) {
    await processPick(pick);
  }
  logger.debug(`Finished processing picks.`);
}

async function processPick(pick: PickData) {
  logger.debug(`Processing pick: ${pick.description}`);
  await seedPickTable(pick);

  logger.debug(`Processing survey picks for episode types`);
  for (const episodeType of pick.episodeType) {
    await seedSurveyPickTable(pick, episodeType);
  }
  logger.debug(`Finished processing survey picks for episode types`);
  await seedPickPointsTable(pick);
  await seedPickOptionsTable(pick);
  logger.debug(`Finished processing pick: ${pick.description}`);
}

async function seedPickTable(pick: PickData) {
  logger.debug(`${models.Picks.tableName}: Creating pick`);
  await models.Picks.create({
    pickId: pick.pickId,
    description: pick.description,
    notes: pick.notes,
    eventType: pick?.eventType || undefined,
  });
  logger.debug(`${models.Picks.tableName}: Created pick`);
}

async function seedSurveyPickTable(pick: PickData, episodeType: EpisodeType) {
  logger.debug(
    `${models.SurveyPicks.tableName}: Creating survey pick for survey type ${pick.episodeType}`
  );
  const surveyDefinition = defaultSurveysData.get(episodeType);
  if (!surveyDefinition) {
    throw new Error(
      `Survey definition not found for episode type: ${episodeType}`
    );
  }
  await models.SurveyPicks.create({
    surveyId: surveyDefinition.surveyId,
    pickId: pick.pickId,
  });
  logger.debug(`${models.SurveyPicks.tableName}: Created survey pick`);
}

async function seedPickPointsTable(pick: PickData) {
  logger.debug(`${models.PickPoints.tableName}: Creating pick points`);
  await models.PickPoints.create({
    pickId: pick.pickId,
    points: pick.points,
  });
  logger.debug(`${models.PickPoints.tableName}: Created pick points`);
}

async function seedPickOptionsTable(pick: PickData) {
  logger.debug(`${models.PickOptions.tableName}: Creating pick options`);
  await models.PickOptions.create({
    pickId: pick.pickId,
    type: pick.type,
    minNumSelections: pick.minNumSelections,
    maxNumSelections: pick.maxNumSelections,
    noneOptionAllowed: pick.noneOptionAllowed,
  });
  logger.debug(`${models.PickOptions.tableName}: Created pick options`);
}

export default pickProcessor;
