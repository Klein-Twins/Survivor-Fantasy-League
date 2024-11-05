import { Sequelize, QueryTypes } from 'sequelize';
import fs from 'fs';

const runSqlFile = async (filePath: string, sequelize: Sequelize) : Promise<void> => {
    try {
        const sqlScript = fs.readFileSync(filePath, {encoding: 'utf8'});
        const commands = sqlScript.split(';').filter(cmd => cmd.trim());
        for (const command of commands) {
            await sequelize.query(command, {type: QueryTypes.RAW });
        }
        console.log("SQL script executed successfully.");
    } catch (error) {
        console.error("Error executing SQL Script:", error);
    }
};

export { runSqlFile };