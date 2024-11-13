import { Sequelize } from 'sequelize';
import fs from 'fs';
import path from 'path';
import { runSqlFile } from '../utils/runSqlFile';  // Assuming you have a separate runSqlFile function
import logger from '../config/logger';

// The function should now expect sequelize as an instance of Sequelize
export const runSqlFilesInDirectory = async (directoryPath: string, sequelize: Sequelize): Promise<void> => {
  // Get all SQL files in the directory
  const sqlFiles = fs
    .readdirSync(directoryPath)
    .filter((file) => file.endsWith(".sql"));

  // Sort files if necessary (optional)
  sqlFiles.sort();

  // Run each SQL file sequentially
  for (const sqlFile of sqlFiles) {
    const sqlFilePath = path.join(directoryPath, sqlFile);
    console.log(`Running SQL file: ${sqlFilePath}`);
    await runSqlFile(sqlFilePath, sequelize);
  }
};
