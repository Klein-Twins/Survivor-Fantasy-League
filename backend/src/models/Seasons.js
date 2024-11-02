const { DataTypes, Model } = require('sequelize');
const SeasonSurvivorCastMembers = require('./SeasonSurvivorCastMembers');

class Seasons extends Model {
  static init(sequelize) {
    return super.init({
      SEASON_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        field: 'SEASON_ID'
      },
      THEME: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'THEME',
      },
      LOCATION: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'LOCATION',
      },
      NAME: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'NAME',
      },
    }, {
      sequelize,
      tableName: 'SSN_SEASONS',
      timestamps: false,
    });
  }

  static associate(models) {
    this.hasMany(models.SeasonSurvivorCastMembers, { foreignKey: 'SEASON_ID'});
  }
}

module.exports = Seasons;