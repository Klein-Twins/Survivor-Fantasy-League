const { Sequelize } = require('sequelize');
const fs = require('fs');

const runSqlFile = async (filePath, sequelize) => {
    try {
        const sqlScript = fs.readFileSync(filePath, {encoding: 'utf8'});
        const commands = sqlScript.split(';').filter(cmd => cmd.trim());
        for (const command of commands) {
            await sequelize.query(command, {type: Sequelize.QueryTypes.RAW });
        }
        console.log("SQL script executed successfully.");
    } catch (error) {
        console.error("Error executing SQL Script:", error);
    }
};

module.exports = { runSqlFile };