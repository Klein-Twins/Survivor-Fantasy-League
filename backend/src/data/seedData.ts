import { NODE_ENV } from '../config/config';
import logger from '../config/logger';
import seedDevData from './dev/SeedDevData';
import seedFoundationData from './foundation/SeedFoundationData';

const seedData = async () => {
  logger.info('Seeding Foundation data...');
  await seedFoundationData();
  if (NODE_ENV === 'development') {
    logger.info('Seeding Dev data...');
    await seedDevData();
  }
};

export default seedData;
