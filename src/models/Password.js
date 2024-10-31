const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');  // Ensure User model is imported for associations

const Password = sequelize.define('USR_PASSWORDS', {
  PASSWORD_SEQ: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    field: "PASSWORD_SEQ"
  },
  USER_ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "USER_ID",
    primaryKey: true,
    references: {
      model: User,
      key: 'USER_ID'
    }
  },
  PASSWORD: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: "PASSWORD"
  },
  ACTIVE: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    field: "ACTIVE"
  },
}, {
  tableName: 'USR_PASSWORDS',
  timestamps: false
});

Password.associate = (models) => {
  Password.primaryKey = ['USER_ID', 'PASSWORD_SEQ'];
};

module.exports = Password;