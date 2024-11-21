import { APP_PORT, NODE_ENV } from './src/config/config.ts';
import { sequelize } from './src/config/db.ts'; 
import path from 'path';
import { runSqlFilesInDirectory } from './src/servicesAndHelpers/sqlHelper.ts'
import server from './app.ts';
const PORT: number = Number(APP_PORT) || 3000;

// Sync the database and then start the server
const startServer = async (): Promise<void> => {
  try {
    await sequelize.sync({ force: true }); // Sync database
    console.log("Database & tables created!");

    // Path to the SQL files directories
    const foundationSqlDirPath = path.join(__dirname, '/src/data/foundation/sql');
    const devSqlDirPath = path.join(__dirname, '/src/data/dev/sql');
    
    // Run foundation SQL files (always)
    await runSqlFilesInDirectory(foundationSqlDirPath, sequelize);

    // Conditionally run dev SQL files if the environment is 'development'
    if (process.env.NODE_ENV === 'development') {
      await runSqlFilesInDirectory(devSqlDirPath, sequelize);
    }

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to sync database and start server:", error);
  }
};

// Only start the server if we are not in the test environment
if(NODE_ENV !== 'test') {
  startServer();
}

export default server;