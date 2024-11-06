import { DataTypes, Model, Sequelize } from 'sequelize';

export interface SeasonsAttributes {
  SEASON_ID: number;   // Primary key of type INTEGER
  THEME?: string;      // Theme of the season (optional)
  LOCATION?: string;   // Location where the season takes place (optional)
  NAME?: string;       // Name of the season (optional)
}

interface SeasonsOptionalCreationAttributes {
  THEME?: string;
  LOCATION?: string;
  NAME?: string;
}

const SeasonsModel = (sequelize: Sequelize) => {
  class Seasons extends Model<SeasonsAttributes, SeasonsOptionalCreationAttributes> implements SeasonsAttributes {
    public SEASON_ID!: number;
    public THEME?: string;
    public LOCATION?: string;
    public NAME?: string;

    static associate(models: any) {
      this.hasMany(models.SeasonSurvivorCastMembers, { foreignKey: 'SEASON_ID' });
      this.hasMany(models.League, {foreignKey: 'SEASON_ID'})
    }
  }

  Seasons.init(
    {
      SEASON_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
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