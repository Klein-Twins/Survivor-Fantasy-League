import { models } from '../../config/db';
import {
  season47episodeSurveyData,
  season48episodeSurveyData,
} from '../foundation/surveyData/episodeSurveyData';
import testPasswordData from './accountData/testPasswordData';
import testProfileData from './accountData/testProfileData';
import testUserData from './accountData/testUserData';
import testLeague1SurveyData from './leagueData/testLeague1SurveyData';
import testLeagueData from './leagueData/testLeagueData';
import testLeagueProfilesData from './leagueData/testLeagueProfilesData';

const seedTestAccountData = async () => {
  await models.Profile.destroy({ where: {} });
  await models.Profile.bulkCreate(testProfileData, { validate: true });
  await models.User.destroy({ where: {} });
  await models.User.bulkCreate(testUserData, { validate: true });
  await models.Password.destroy({ where: {} });
  await models.Password.bulkCreate(testPasswordData, { validate: true });
};

const seedLeagueData = async () => {
  await models.League.destroy({ where: {} });
  await models.League.bulkCreate(testLeagueData, { validate: true });

  await models.LeagueProfile.destroy({ where: {} });
  await models.LeagueProfile.bulkCreate(testLeagueProfilesData, {
    validate: true,
  });

  await models.EpisodeSurvey.destroy({ where: {} });
  await models.EpisodeSurvey.bulkCreate(season47episodeSurveyData, {
    validate: true,
  });
  await models.EpisodeSurvey.bulkCreate(season48episodeSurveyData, {
    validate: true,
  });
};

const seedDevData = async () => {
  await seedTestAccountData();
  await seedLeagueData();
};

export default seedDevData;
