const { DataTypes, Model } = require('sequelize');
const Seasons = require('./Seasons');
const Survivors = require('./Survivors');

class SeasonSurvivorCastMembers extends Model {
  static init(sequelize) {
    return super.init({
      SURVIVOR_ID: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        field: 'SURVIVOR_ID'
      },
      SEASON_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        field: 'SEASON_ID',
      },
      ORIGINAL_TRIBE_ID: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'ORIGINAL_TRIBE_ID',
      },
      AGE: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'AGE',
      },
      DESCRIPTION: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: 'DESCRIPTION',
      },
      JOB: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'JOB',
      }
    }, {
      sequelize, // Pass the sequelize instance
      tableName: 'SSN_SURVIVORS',
      timestamps: false,
    });
  }

  static associate(models) {
    this.belongsTo(models.Survivors, {foreignKey: 'SURVIVOR_ID'});
    this.belongsTo(models.Seasons, {foreignKey: 'SEASON_ID'});
  }
}

module.exports = SeasonSurvivorCastMembers;