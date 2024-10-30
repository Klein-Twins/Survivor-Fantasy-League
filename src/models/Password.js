const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');  // Ensure User model is imported for associations

const Password = sequelize.define('USR_PASSWORDS', {
  PASSWORD_SEQ: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "PASSWORD_SEQ"
  },
  USER_ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "USER_ID"
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
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['PASSWORD_SEQ', 'USER_ID'],
    },
  ],
});

Password.belongsTo(User, { foreignKey: 'USER_ID' });
module.exports = Password;