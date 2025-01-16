import { Sequelize } from 'sequelize';
import initModels from '../models/InitModels';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME, NODE_ENV } from './config';

interface DbConfig {
  username: string
  password: string
  database: string
  host: string
  port: number
  dialect: 'postgres';
}

type Environment = 'development' | 'test' | 'production';

const dbConfig: Record<Environment, DbConfig> = {
  development: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres',
  },
  test: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: `${DB_NAME}_tests`,
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres',
  },
  production: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: `${DB_NAME}_production`,
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres',
  },
};

const currentConfig: DbConfig = dbConfig[NODE_ENV as Environment || 'development'];

// Create a new Sequelize instance
const sequelize = new Sequelize(currentConfig.database!, currentConfig.username!, currentConfig.password!, {
  host: currentConfig.host,
  port: currentConfig.port,
  dialect: currentConfig.dialect,
  logging: true, // Set to true for visibility of SQL queries
});

// Testing the connection
const testConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    if (NODE_ENV !== 'test')
      console.log(`Connection to the database ${currentConfig.database} has been established successfully.`);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

testConnection();

const models = initModels(sequelize);

export { sequelize, dbConfig, models };