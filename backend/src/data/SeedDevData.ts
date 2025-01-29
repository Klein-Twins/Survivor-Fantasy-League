import { models } from '../config/db';
import LeagueData from './dev/leagueData';
import picksData from './dev/picksData';
import userData from './dev/userData';
import seasonData from './foundation/seasonData';
import season47SurvivorData from './foundation/survivorData';

const seedDevData = async () => {
  // Season Data
  await models.Seasons.destroy({ where: {} });
  await models.Seasons.bulkCreate(seasonData, { validate: true });

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
};

export default seedDevData;
