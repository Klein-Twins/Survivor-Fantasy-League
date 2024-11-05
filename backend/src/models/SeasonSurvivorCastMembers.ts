import { DataTypes, Model, Sequelize } from 'sequelize';
import { SurvivorsAttributes } from './Survivors';

export interface SeasonSurvivorCastMembersAttributes {
  SURVIVOR_ID: string;       // Primary key for the survivor
  SEASON_ID: number;         // Primary key for the season
  ORIGINAL_TRIBE_ID?: string; // ID for the original tribe (not optional anymore)
  AGE: number;              // Age of the cast member (not optional anymore)
  DESCRIPTION: string;      // Description of the cast member (not optional anymore)
  JOB: string;              // Job of the cast member (not optional anymore)
  IMAGE_URL: string;        // URL for the cast member's image (not optional anymore)
}

export interface SeasonSurvivorCastMembersOptionalAttributes {
  ORIGINAL_TRIBE_ID?: string
}

const SeasonSurvivorCastMembersModel = (sequelize: Sequelize) => {
  class SeasonSurvivorCastMembers extends Model<SeasonSurvivorCastMembersAttributes, SeasonSurvivorCastMembersOptionalAttributes> implements SeasonSurvivorCastMembersAttributes {
    public SURVIVOR_ID!: string;
    public SEASON_ID!: number;
    public ORIGINAL_TRIBE_ID?: string;
    public AGE!: number;
    public DESCRIPTION!: string;
    public JOB!: string;
    public IMAGE_URL!: string;

    static associate(models: any) {
      this.belongsTo(models.Survivors, { foreignKey: 'SURVIVOR_ID' });
      this.belongsTo(models.Seasons, { foreignKey: 'SEASON_ID', });
    }
  }

  SeasonSurvivorCastMembers.init(
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
        allowNull: true, // Changed to false
        field: 'ORIGINAL_TRIBE_ID',
      },
      AGE: {
        type: DataTypes.INTEGER,
        allowNull: false, // Changed to false
        field: 'AGE',
      },
      DESCRIPTION: {
        type: DataTypes.STRING(500),
        allowNull: false, // Changed to false
        field: 'DESCRIPTION',
      },
      JOB: {
        type: DataTypes.STRING(100),
        allowNull: false, // Changed to false
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
      timestamps: false, // Set to false since the old model didn't have timestamps
    }
  );

  return SeasonSurvivorCastMembers;
};

export default SeasonSurvivorCastMembersModel;