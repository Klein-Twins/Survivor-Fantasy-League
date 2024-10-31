const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('USR_USERS', {
    USER_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'USER_ID',
    },
    USER_NAME: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: "USER_NAME"
    },
    USER_PROFILE_ID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "USER_PROFILE_ID"
    }
}, {
    tableName: 'USR_USERS',
    timestamps: false
});

module.exports = User;
