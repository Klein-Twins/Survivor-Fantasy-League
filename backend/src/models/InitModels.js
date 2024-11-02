const User = require('./User'); // Adjust path as needed
const Password = require('./Password'); // Adjust path as needed
const Survivors = require('./Survivors');
const Seasons = require('./Seasons');
const SeasonSurvivorCastMembers = require('./SeasonSurvivorCastMembers');

const initModels = (sequelize) => {
  // Initialize models
  User.init(sequelize);
  Password.init(sequelize);
  Survivors.init(sequelize);
  Seasons.init(sequelize);
  SeasonSurvivorCastMembers.init(sequelize);
  
  // Set up associations
  User.associate({ USR_PASSWORDS: Password });
  Password.associate({ USR_USERS: User });
  Seasons.associate({ SeasonSurvivorCastMembers});
  Survivors.associate({ SeasonSurvivorCastMembers });
  SeasonSurvivorCastMembers.associate({ Survivors, Seasons});
};

module.exports = initModels;