import { models } from '../../config/db';
import logger from '../../config/logger';
import pickOptionsData from './pickData/pickOptionsData';
import picksData from './pickData/picksData';
import season47ChallengesData from './seasonData/47/challengeData';
import season47ChallengeWinnersData from './seasonData/47/challengeWinnersData';
import season47EliminationData from './seasonData/47/eliminationData';
import season47EpisodeData from './seasonData/47/episodeData';
import season47SurvivorData from './seasonData/47/survivorData';
import season47TribeData from './seasonData/47/tribeData';
import season48ChallengesData from './seasonData/48/challengeData';
import { season48ChallengeWinnersData } from './seasonData/48/challengeWinnerData';
import season48EliminationData from './seasonData/48/eliminationData';
import season48EpisodeData from './seasonData/48/episodeData';
import season48SurvivorData from './seasonData/48/survivorData';
import season48TribeData from './seasonData/48/tribeData';
import seasonData from './seasonData/seasonData';
import defaultSurveysData from './surveyData/defaultSurveysData';
import surveyPicksData from './surveyData/surveyPicksData';
import survivorsData from './survivorData/survivorsData';

const seedSeasonData = async () => {
  await models.Seasons.destroy({ where: {} });
  await models.Seasons.bulkCreate(seasonData, { validate: true });
};

const seedSurvivorData = async () => {
  await models.Survivors.destroy({ where: {} });
  await models.Survivors.bulkCreate(survivorsData, { validate: true });
};

const seedSeason47Data = async () => {
  await models.Episode.destroy({ where: {} });
  await models.Episode.bulkCreate(season47EpisodeData, { validate: true });
  await models.Episode.bulkCreate(season48EpisodeData, { validate: true });

  await models.SurvivorDetailsOnSeason.destroy({ where: {} });
  await models.SurvivorDetailsOnSeason.bulkCreate(season47SurvivorData, {
    validate: true,
  });
  await models.SurvivorDetailsOnSeason.bulkCreate(season48SurvivorData, {
    validate: true,
  });

  await models.Tribe.destroy({ where: {} });
  await models.Tribe.bulkCreate(season47TribeData, { validate: true });
  await models.Tribe.bulkCreate(season48TribeData, { validate: true });

  await models.SeasonEliminations.destroy({ where: {} });
  await models.SeasonEliminations.bulkCreate(season47EliminationData, {
    validate: true,
  });
  await models.SeasonEliminations.bulkCreate(season48EliminationData, {
    validate: true,
  });

  await models.Challenges.destroy({ where: {} });
  await models.Challenges.bulkCreate(season47ChallengesData, {
    validate: true,
  });
  await models.Challenges.bulkCreate(season48ChallengesData, {
    validate: true,
  });

  await models.ChallengeWinners.destroy({ where: {} });
  await models.ChallengeWinners.bulkCreate(season47ChallengeWinnersData, {
    validate: true,
  });
  await models.ChallengeWinners.bulkCreate(season48ChallengeWinnersData, {
    validate: true,
  });
};

const seedPicksAndSurveys = async () => {
  logger.debug('Seeding pick options...');
  await models.PickOptions.destroy({ where: {} });
  await models.PickOptions.bulkCreate(pickOptionsData, { validate: true });

  logger.debug('Seeding picks...');
  await models.Picks.destroy({ where: {} });
  await models.Picks.bulkCreate(picksData, { validate: true });

  logger.debug('Seeding surveys...');
  await models.Survey.destroy({ where: {} });
  await models.Survey.bulkCreate(defaultSurveysData, { validate: true });

  logger.debug('Seeding survey picks');
  await models.SurveyPicks.destroy({ where: {} });
  await models.SurveyPicks.bulkCreate(surveyPicksData, { validate: true });
};

const seedFoundationData = async () => {
  logger.debug('Seeding season data...');
  await seedSeasonData();
  logger.debug('Seeding survivor data...');
  await seedSurvivorData();
  logger.debug('Seeding season 47 data...');
  await seedSeason47Data();
  logger.debug('Seeding picks and surveys...');
  await seedPicksAndSurveys();
};

export default seedFoundationData;
