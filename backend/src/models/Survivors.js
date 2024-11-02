const { DataTypes, Model } = require('sequelize');
const SeasonSurvivorCastMembers = require('./SeasonSurvivorCastMembers');

class Survivors extends Model {
  static init(sequelize) {
    return super.init({
      SURVIVOR_ID: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        field: 'SURVIVOR_ID'
      },
      FIRST_NAME: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'FIRST_NAME',
      },
      LAST_NAME: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'LAST_NAME',
      },
      NICK_NAME: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'NICK_NAME',
      },
      FROM_CITY: {
        type: DataTypes.STRING(60),
        allowNull: true,
        field: 'FROM_CITY',
      },
      FROM_STATE: {
        type: DataTypes.STRING(60),
        allowNull: false,
        field: 'FROM_STATE',
      },
      FROM_COUNTRY: {
        type: DataTypes.CHAR(2),
        allowNull: false,
        field: 'FROM_COUNTRY',
      },

    }, {
      sequelize, // Pass the sequelize instance
      tableName: 'CST_SURVIVORS',
      timestamps: false,
    });
  }

  static associate(models) {
    this.hasMany(models.SeasonSurvivorCastMembers, {foreignKey: 'SURVIVOR_ID'});
  }
}

module.exports = Survivors;