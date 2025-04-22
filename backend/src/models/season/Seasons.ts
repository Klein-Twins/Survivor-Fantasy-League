import { DataTypes, Model, Sequelize } from 'sequelize';
import logger from '../../config/logger';

export interface SeasonsAttributes {
  seasonId: number;
  theme: string;
  location: string;
  name: string;
  startDate: Date | null;
  endDate: Date | null;
  isActive: boolean;
}

export interface SeasonsCreationAttributes
  extends Omit<SeasonsAttributes, 'seasonId' | 'isActive'> {}

export interface SeasonsCreationAttributes extends SeasonsAttributes {}

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
          onDelete: 'CASCADE',
        });
      } else {
        logger.error('Error associating Seasons with League');
      }
      if (models.SurvivorDetailsOnSeason) {
        this.hasMany(models.SurvivorDetailsOnSeason, {
          foreignKey: 'seasonId',
          sourceKey: 'seasonId',
          as: 'seasonDetails',
          onDelete: 'CASCADE',
        });
      } else {
        logger.error('Error associating Seasons with SurvivorDetailsOnSeason');
      }
      if (models.Episode) {
        this.hasMany(models.Episode, {
          foreignKey: 'seasonId',
          sourceKey: 'seasonId',
          as: 'episode',
          onDelete: 'CASCADE',
        });
      } else {
        logger.error('Error associating Seasons with Episode');
      }
      if (models.Tribe) {
        this.hasMany(models.Tribe, {
          foreignKey: 'seasonId',
          sourceKey: 'seasonId',
          as: 'tribes',
          onDelete: 'CASCADE',
        });
      } else {
        logger.error('Error associating Seasons with Tribe');
      }
      if (models.SeasonEliminations) {
        this.hasMany(models.SeasonEliminations, {
          foreignKey: 'seasonId',
          sourceKey: 'seasonId',
          as: 'eliminations',
          onDelete: 'CASCADE',
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
        validate: {
          notEmpty: {
            msg: 'Theme is required',
          },
          len: {
            args: [1, 100],
            msg: 'Theme must be between 1 and 100 characters',
          },
        },
      },
      location: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'LOCATION',
        validate: {
          notEmpty: {
            msg: 'Location is required',
          },
          len: {
            args: [1, 100],
            msg: 'Location must be between 1 and 100 characters',
          },
        },
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'NAME',
        validate: {
          len: {
            args: [0, 100],
            msg: 'Name must be at most 100 characters',
          },
        },
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'START_DATE',
        validate: {
          isDate: {
            args: true, // Add this line
            msg: 'Start date must be a valid date',
          },
        },
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'END_DATE',
        validate: {
          isDate: {
            args: true, // Add this line
            msg: 'End date must be a valid date',
          },
          isAfterStartDate(value: Date | null) {
            if (value && this.startDate && value < this.startDate) {
              throw new Error('End date must be after the start date');
            }
          },
        },
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
