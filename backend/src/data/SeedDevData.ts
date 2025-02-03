import { models } from '../config/db';
import LeagueData from './dev/leagueData';
import leagueSurveys from './dev/leagueSurveyData';
import picksData from './dev/picksData';
import { season47Challenges } from './dev/seasonChallengeData';
import { season47ChallengeResults } from './dev/seasonChallengeWinnersData';
import seasonEliminationData from './dev/seasonEliminationData';
import surveyData from './dev/surveyData';
import tribeData from './dev/tribeData';
import userData from './dev/userData';
import seasonAndEpisodeData from './foundation/seasonData';
import season47SurvivorData from './foundation/survivorData';

const seedDevData = async () => {
  // Season Data
  await models.Seasons.destroy({ where: {} });
  await models.Seasons.bulkCreate(seasonAndEpisodeData.seasonData, { validate: true });
  await models.Episode.destroy({ where: {} });
  await models.Episode.bulkCreate(seasonAndEpisodeData.episodeData, { validate: true });

  //Tribe Data
  await models.Tribe.destroy({ where: {} });
  await models.Tribe.bulkCreate(tribeData.tribes, { validate: true });

  // Survivor Data
  await models.Survivors.destroy({ where: {} });
  await models.Survivors.bulkCreate(season47SurvivorData.survivors, { validate: true });
  await models.SurvivorDetailsOnSeason.destroy({ where: {} });
  await models.SurvivorDetailsOnSeason.bulkCreate(season47SurvivorData.survivorSeasons, { validate: true });

  // User Data
  await models.Profile.destroy({ where: {} });
  await models.Profile.bulkCreate(userData.profiles, { validate: true });

  await models.User.destroy({ where: {} });
  await models.User.bulkCreate(userData.users, { validate: true });

  await models.Password.destroy({ where: {} });
  await models.Password.bulkCreate(userData.passwords, { validate: true });

  // League Data
  await models.League.destroy({ where: {} });
  await models.League.bulkCreate(LeagueData.leagues, { validate: true });
  await models.LeagueProfile.destroy({ where: {} });
  await models.LeagueProfile.bulkCreate(LeagueData.leagueProfiles, { validate: true });

  await models.PickOptions.destroy({ where: {} });
  await models.PickOptions.bulkCreate(picksData.pickOptions, { validate: true });
  await models.Picks.destroy({ where: {} });
  await models.Picks.bulkCreate(picksData.picks, { validate: true });

  await models.Survey.destroy({ where: {} });
  await models.Survey.bulkCreate(surveyData.surveys, { validate: true });

  await models.SurveyPicks.destroy({ where: {} });
  await models.SurveyPicks.bulkCreate(surveyData.surveyPicks, { validate: true });

  await models.LeagueSurveys.destroy({ where: {} });
  await models.LeagueSurveys.bulkCreate(leagueSurveys, { validate: true });

  await models.Challenges.destroy({ where: {} });
  await models.Challenges.bulkCreate(season47Challenges, { validate: true });

  await models.ChallengeWinners.destroy({ where: {} });
  await models.ChallengeWinners.bulkCreate(season47ChallengeResults, { validate: true });

  await models.SeasonEliminations.destroy({ where: {} });
  await models.SeasonEliminations.bulkCreate(seasonEliminationData.season47EliminationData, { validate: true });
};

export default seedDevData;
