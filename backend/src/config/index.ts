import fs from 'fs';
import path from 'path';
import { Sequelize, DataTypes } from 'sequelize';
import process from 'process';
import { NODE_ENV } from './config';

const basename = path.basename(__filename);
const env = NODE_ENV || 'development';
const config = require(path.join(__dirname, '/../config/config.json'))[env];
const db: { [key: string]: any } = {}; // Using `any` for model types, adjust as necessary

let sequelize: Sequelize;

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable]!, config);
} else {
  sequelize = new Sequelize(config.database!, config.username!, config.password!, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

// Set up associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;