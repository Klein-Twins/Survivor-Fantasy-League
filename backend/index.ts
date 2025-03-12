import server from './app.ts';
import { APP_HOST, APP_PORT } from './src/config/config.ts';
import sequelize from './src/config/db.ts';
import logger from './src/config/logger.ts';
import seedData from './src/data/seedData.ts';

const PORT: number = Number(APP_PORT);
const IP: string = APP_HOST;

const startServer = async (): Promise<void> => {
  try {
    await sequelize.sync({ force: true });
    logger.info('Database synced successfully');

    logger.info('Seeding data...');
    await seedData();
    logger.info('Data seeded successfully');

    server.listen(PORT, () => {
      console.log(`Server running on ${IP}:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to sync database and start server:', error);
  }
};

startServer();

export default server;
