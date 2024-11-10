import { DataTypes, Model, Sequelize } from 'sequelize';

export interface SurvivorDetailsOnSeasonAttributes {
  SURVIVOR_ID: string;                // Primary key for the survivor
  SEASON_ID: number;                  // Primary key for the season
  ORIGINAL_TRIBE_ID?: string | null;  // ID for the original tribe (not optional anymore)
  AGE: number;                        // Age of the cast member (not optional anymore)
  DESCRIPTION: string;                // Description of the cast member (not optional anymore)
  JOB: string;                        // Job of the cast member (not optional anymore)
  IMAGE_URL: string;                  // URL for the cast member's image (not optional anymore)
}

const SurvivorDetailsOnSeasonModel = (sequelize: Sequelize) => {
  class SurvivorDetailsOnSeason extends Model<SurvivorDetailsOnSeasonAttributes> implements SurvivorDetailsOnSeasonAttributes {
    public SURVIVOR_ID!: string;
    public SEASON_ID!: number;
    public ORIGINAL_TRIBE_ID?: string | null;
    public AGE!: number;
    public DESCRIPTION!: string;
    public JOB!: string;
    public IMAGE_URL!: string;

    static associate(models: any) {
      this.belongsTo(models.Survivors, { foreignKey: 'SURVIVOR_ID', as: 'Survivor'});
      this.belongsTo(models.Seasons, { foreignKey: 'SEASON_ID', as: 'Season' });
    }
  }

  SurvivorDetailsOnSeason.init(
    {
      SURVIVOR_ID: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        field: 'SURVIVOR_ID',
      },
      SEASON_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        field: 'SEASON_ID',
      },
      ORIGINAL_TRIBE_ID: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'ORIGINAL_TRIBE_ID',
      },
      AGE: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'AGE',
      },
      DESCRIPTION: {
        type: DataTypes.STRING(500),
        allowNull: false,
        field: 'DESCRIPTION',
      },
      JOB: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'JOB',
      },
      IMAGE_URL: {
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