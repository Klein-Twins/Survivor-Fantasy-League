const { Sequelize } = require('sequelize');
const User = require('./User'); // Adjust path as needed
const Password = require('./Password'); // Adjust path as needed

const initModels = (sequelize) => {
  // Initialize models
  User.init(sequelize);
  Password.init(sequelize);
  
  // Set up associations
  User.associate({ USR_PASSWORDS: Password });
  Password.associate({ USR_USERS: User });
};

module.exports = initModels;