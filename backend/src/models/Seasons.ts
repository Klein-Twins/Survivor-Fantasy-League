import { DataTypes, Model, Sequelize } from 'sequelize';

export interface SeasonsAttributes {
  SEASON_ID: number;          // Primary key of type INTEGER
  THEME?: string | null;      // Theme of the season (optional)
  LOCATION?: string | null;   // Location where the season takes place (optional)
  NAME?: string | null;       // Name of the season (optional)
}

const SeasonsModel = (sequelize: Sequelize) => {
  class Seasons extends Model<SeasonsAttributes> implements SeasonsAttributes {
    public SEASON_ID!: number;
    public THEME?: string | null;
    public LOCATION?: string | null;
    public NAME?: string | null;

    static associate(models: any) {
      this.hasMany(models.Leagues, {foreignKey: 'SEASON_ID'})
      this.hasMany(models.SurvivorDetailsOnSeason, { foreignKey: 'SEASON_ID', as: 'SurvivorDetailsOnSeason' });
    }
  }

  Seasons.init(
    {
      SEASON_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        field: 'SEASON_ID',
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