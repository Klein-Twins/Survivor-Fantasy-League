import { DataTypes, Model, Sequelize } from 'sequelize';

export interface SeasonsAttributes {
  seasonId: number; // Primary key of type INTEGER
  theme: string; // Theme of the season (optional)
  location: string; // Location where the season takes place (optional)
  name: string; // Name of the season (optional)
  startDate: Date; // Start date of the season
  endDate: Date; // End date of the season
}

const SeasonsModel = (sequelize: Sequelize) => {
  class Seasons extends Model<SeasonsAttributes> implements SeasonsAttributes {
    public seasonId!: number;
    public theme!: string;
    public location!: string;
    public name!: string;
    public startDate!: Date;
    public endDate!: Date;

    static associate(models: any) {
      this.hasMany(models.League, { foreignKey: 'seasonId' });
      this.hasMany(models.SurvivorDetailsOnSeason, { foreignKey: 'seasonId', as: 'SurvivorDetailsOnSeason' });
      this.hasMany(models.Episode, { foreignKey: 'seasonId', as: 'episode' });

      this.hasMany(models.SeasonEliminations, {
        foreignKey: 'seasonId',
        sourceKey: 'seasonId',
        as: 'eliminations',
      });
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
