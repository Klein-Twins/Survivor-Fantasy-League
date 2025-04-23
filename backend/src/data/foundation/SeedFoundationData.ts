import logger from '../../config/logger';
import seasonProcessor from './processing/ssnBackup/season';
import { season48 } from './data/ssn/48/season48Backup';
import season47 from './data/ssn/47/season47';
import surveyProcessor from './processing/sur/survey';
import pickProcessor from './processing/sur/pick';
import { picksData } from './data/surveysAndPicks/pickData/picksData';

const seedFoundationData = async () => {
  const season48Data = season48;
  logger.debug('Seeding season 48 data...');
  await seasonProcessor.processSeason(season48Data);
  logger.debug('Seeding season 47 data...');
  await seasonProcessor.processSeason(season47);

  logger.debug('Seeding picks and surveys...');
  await surveyProcessor.processSurveyDefinitions();
  await surveyProcessor.processEpisodeSurveys();
  await pickProcessor.processPicks(picksData);
};

export default seedFoundationData;
