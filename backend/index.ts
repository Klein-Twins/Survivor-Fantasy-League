// src/index.ts
import app from './app.ts';
import { APP_PORT, NODE_ENV } from './src/config/config.ts';
import { sequelize } from './src/config/db.ts'; // Import the initialized models
import { runSqlFile } from './src/utils/runSqlFile.ts';
import path from 'path';

const PORT: number = Number(APP_PORT) || 3000;

// Sync the database and then start the server
const startServer = async (): Promise<void> => {
  try {
    await sequelize.sync({ force: true }); // Sync database
    console.log("Database & tables created!");

    const sqlFilePath: string = path.join(__dirname, '/src/data/sql/Season47AndSurvivors.sql');
    await runSqlFile(sqlFilePath, sequelize);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to sync database and start server:", error);
  }
};

// Start the server
if(NODE_ENV !== 'test') {
  startServer();
}

export default app;