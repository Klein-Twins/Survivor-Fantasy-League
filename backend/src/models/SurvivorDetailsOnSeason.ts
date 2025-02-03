import { DataTypes, Model, Sequelize } from 'sequelize';

export interface SurvivorDetailsOnSeasonAttributes {
  survivorId: string; // Primary key for the survivor
  seasonId: number; // Primary key for the season
  originalTribeId?: string | null; // ID for the original tribe (not optional anymore)
  age: number; // Age of the cast member (not optional anymore)
  description: string; // Description of the cast member (not optional anymore)
  job: string; // Job of the cast member (not optional anymore)
  imageUrl: string; // URL for the cast member's image (not optional anymore)
}

const SurvivorDetailsOnSeasonModel = (sequelize: Sequelize) => {
  class SurvivorDetailsOnSeason
    extends Model<SurvivorDetailsOnSeasonAttributes>
    implements SurvivorDetailsOnSeasonAttributes
  {
    public survivorId!: string;
    public seasonId!: number;
    public originalTribeId?: string | null;
    public age!: number;
    public description!: string;
    public job!: string;
    public imageUrl!: string;

    static associate(models: any) {
      this.belongsTo(models.Survivors, { foreignKey: 'survivorId', as: 'Survivor' });
      this.belongsTo(models.Seasons, { foreignKey: 'seasonId', as: 'Season' });
      this.hasMany(models.SeasonEliminations, {
        foreignKey: 'survivorId',
        sourceKey: 'survivorId',
        as: 'eliminations',
      });
    }
  }

  SurvivorDetailsOnSeason.init(
    {
      survivorId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        field: 'SURVIVOR_ID',
      },
      seasonId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        field: 'SEASON_ID',
      },
      originalTribeId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'ORIGINAL_TRIBE_ID',
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'AGE',
      },
      description: {
        type: DataTypes.STRING(500),
        allowNull: false,
        field: 'DESCRIPTION',
      },
      job: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'JOB',
      },
      imageUrl: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'IMAGE_URL',
      },
    },
    {
      sequelize,
      tableName: 'SSN_SURVIVORS',
      timestamps: false,
    }
  );

  return SurvivorDetailsOnSeason;
};

export default SurvivorDetailsOnSeasonModel;
