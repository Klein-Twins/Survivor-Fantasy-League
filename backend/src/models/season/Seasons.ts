import { DataTypes, Model, Sequelize } from 'sequelize';
import logger from '../../config/logger';

export interface SeasonsAttributes {
  seasonId: number; // Primary key of type INTEGER
  theme: string; // Theme of the season (optional)
  location: string; // Location where the season takes place (optional)
  name: string; // Name of the season (optional)
  startDate: Date; // Start date of the season
  endDate: Date; // End date of the season
  isActive: boolean;
}

const SeasonsModel = (sequelize: Sequelize) => {
  class Seasons extends Model<SeasonsAttributes> implements SeasonsAttributes {
    public seasonId!: SeasonsAttributes['seasonId'];
    public theme!: SeasonsAttributes['theme'];
    public location!: SeasonsAttributes['location'];
    public name!: SeasonsAttributes['name'];
    public startDate!: SeasonsAttributes['startDate'];
    public endDate!: SeasonsAttributes['endDate'];
    public isActive!: boolean;

    static associate(models: any) {
      if (models.League) {
        this.hasMany(models.League, {
          foreignKey: 'seasonId',
          sourceKey: 'seasonId',
          as: 'leagues',
        });
      } else {
        logger.error('Error associating Seasons with League');
      }
      if (models.SurvivorDetailsOnSeason) {
        this.hasMany(models.SurvivorDetailsOnSeason, {
          foreignKey: 'seasonId',
          sourceKey: 'seasonId',
          as: 'seasonDetails',
        });
      } else {
        logger.error('Error associating Seasons with SurvivorDetailsOnSeason');
      }
      if (models.Episode) {
        this.hasMany(models.Episode, {
          foreignKey: 'seasonId',
          sourceKey: 'seasonId',
          as: 'episode',
        });
      } else {
        logger.error('Error associating Seasons with Episode');
      }
      if (models.Tribe) {
        this.hasMany(models.Tribe, {
          foreignKey: 'seasonId',
          sourceKey: 'seasonId',
          as: 'tribes',
        });
      } else {
        logger.error('Error associating Seasons with Tribe');
      }
      if (models.SeasonEliminations) {
        this.hasMany(models.SeasonEliminations, {
          foreignKey: 'seasonId',
          sourceKey: 'seasonId',
          as: 'eliminations',
        });
      } else {
        logger.error('Error associating Seasons with SeasonEliminations');
      }
    }
  }

  Seasons.init(
    {
      seasonId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        field: 'SEASON_ID',
      },
      theme: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'THEME',
      },
      location: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'LOCATION',
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'NAME',
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'START_DATE',
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'END_DATE',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        field: 'IS_ACTIVE',
      },
    },
    {
      sequelize,
      tableName: 'SSN_SEASONS',
      timestamps: false,
    }
  );

  return Seasons;
};

export default SeasonsModel;
