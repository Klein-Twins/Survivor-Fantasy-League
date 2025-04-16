import { NODE_ENV } from '../config/config';
import logger from '../config/logger';
import accountProcessor from './dev/processing/account/accountProcessor';
import leagueProcessor from './dev/processing/lge/leagueProcessor';
import seedDevData from './dev/SeedDevData';
import { picksData } from './foundation/data/surveysAndPicks/pickData/picksData';
import seasonProcessor from './foundation/processing/ssn/season';
import pickProcessor from './foundation/processing/sur/pick';
import surveyProcessor from './foundation/processing/sur/survey';
import seedFoundationData from './foundation/SeedFoundationData';

const seedData = async () => {
  await accountProcessor.processTestAccounts();

  await surveyProcessor.processSurveyDefinitions();

  await pickProcessor.processPicks(picksData);
  await seasonProcessor.processSeasons();
};

export default seedData;
