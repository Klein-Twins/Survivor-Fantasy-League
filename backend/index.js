const app = require('./app');
const { sequelize } = require('./src/config/dbConfig');
const initModels = require('./src/models/InitModels');

const { runSqlFile } = require('./src/utils/runSqlFile');

const path = require('path');
const PORT = process.env.PORT || 3000;

const models = initModels(sequelize);

// Sync the database and then start the server
const startServer = async () => {
  try {
    await sequelize.sync({ force: true }); // Sync database
    console.log("Database & tables created!");

    const sqlFilePath = path.join(__dirname, '/src/data/sql/Season47AndSurvivors.sql');
    await runSqlFile(sqlFilePath, sequelize);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to sync database and start server:", error);
  }
};

// Start the server
if(process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = app; // Export the app for testing