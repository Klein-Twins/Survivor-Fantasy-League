import { DataTypes, Model, Sequelize } from 'sequelize';

export interface SeasonsAttributes {
  seasonId: number;          // Primary key of type INTEGER
  theme?: string | null;      // Theme of the season (optional)
  location?: string | null;   // Location where the season takes place (optional)
  name?: string | null;       // Name of the season (optional)
}

const SeasonsModel = (sequelize: Sequelize) => {
  class Seasons extends Model<SeasonsAttributes> implements SeasonsAttributes {
    public seasonId!: number;
    public theme?: string | null;
    public location?: string | null;
    public name?: string | null;

    static associate(models: any) {
      this.hasMany(models.Leagues, {foreignKey: 'seasonId'})
      this.hasMany(models.SurvivorDetailsOnSeason, { foreignKey: 'seasonId', as: 'SurvivorDetailsOnSeason' });
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
        allowNull: true,
        field: 'THEME',
      },
      location: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'LOCATION',
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'NAME',
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