require('dotenv').config();
const { Sequelize } = require('sequelize');

const dbConfig = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: `${process.env.DB_NAME}_tests`, // Use a different test database name
    host: process.env.DB_HOST,
    dialect: 'postgres',
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: `${process.env.DB_NAME}_production`, // Use a different production database name
    host: process.env.DB_HOST,
    dialect: 'postgres',
  },
};

const currentConfig = dbConfig[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(currentConfig.database, currentConfig.username, currentConfig.password, {
  host: currentConfig.host,
  dialect: currentConfig.dialect,
  logging: false //Set to true for visibility of SQL queries.
});

//Testing the connection:
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log(`Connection to the database ${currentConfig.database} has been established successfully.`);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

testConnection();

module.exports = { sequelize, dbConfig };