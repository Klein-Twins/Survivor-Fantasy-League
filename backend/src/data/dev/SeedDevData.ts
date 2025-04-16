import { models } from '../../config/db';

import testPasswordData from './accountData/testPasswordData';
import testProfileData from './accountData/testProfileData';
import testUserData from './accountData/testUserData';
import season48TestLeagues from './leagueData/leagues48';
import testSurveyData from './leagueData/survey/testLeagueSurveys';
import leagueProcessor from './processing/lge/leagueProcessor';
import surveyProcessor from './processing/lge/surveys/surveyProcessor';

const seedTestAccountData = async () => {
  await models.Profile.destroy({ where: {} });
  await models.Profile.bulkCreate(testProfileData, { validate: true });
  await models.User.destroy({ where: {} });
  await models.User.bulkCreate(testUserData, { validate: true });
  await models.Password.destroy({ where: {} });
  await models.Password.bulkCreate(testPasswordData, { validate: true });
};

const seedLeagueData = async () => {
  for (const league of season48TestLeagues) {
    await leagueProcessor.processLeague(league);
  }
  await surveyProcessor.processSurveysForLeagueMember(
    testSurveyData.tonyStarkLeague1Surveys
  );
};

const seedDevData = async () => {
  await seedTestAccountData();
  await seedLeagueData();
};

export default seedDevData;
