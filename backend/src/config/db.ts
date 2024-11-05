import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import initModels from '../models/InitModels';
dotenv.config();

interface DbConfig {
  username: string | undefined;
  password: string | undefined;
  database: string | undefined;
  host: string | undefined;
  dialect: 'postgres';
}
type Environment = 'development' | 'test' | 'production';

const dbConfig: Record<Environment, DbConfig> = {
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
    database: `${process.env.DB_NAME}_tests`,
    host: process.env.DB_HOST,
    dialect: 'postgres',
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: `${process.env.DB_NAME}_production`,
    host: process.env.DB_HOST,
    dialect: 'postgres',
  },
};

const currentConfig: DbConfig = dbConfig[process.env.NODE_ENV as Environment || 'development'];

// Create a new Sequelize instance
const sequelize = new Sequelize(currentConfig.database!, currentConfig.username!, currentConfig.password!, {
  host: currentConfig.host,
  dialect: currentConfig.dialect,
  logging: true, // Set to true for visibility of SQL queries
});

// Testing the connection
const testConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log(`Connection to the database ${currentConfig.database} has been established successfully.`);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

testConnection();

const models = initModels(sequelize);

export { sequelize, dbConfig, models };