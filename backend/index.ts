import server from './app.ts';
import { APP_PORT, NODE_ENV } from './src/config/config.ts';
import { sequelize } from './src/config/db.ts';
import seedDevData from './src/data/SeedDevData.ts';
const PORT: number = Number(APP_PORT) || 3000;

// Sync the database and then start the server
const startServer = async (): Promise<void> => {
  try {
    await sequelize.sync({ force: true }); // Sync database
    console.log('Database & tables created!');

    if (process.env.NODE_ENV === 'development') {
      await seedDevData();
    }

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to sync database and start server:', error);
  }
};

// Only start the server if we are not in the test environment
if (NODE_ENV !== 'test') {
  startServer();
}

export default server;
