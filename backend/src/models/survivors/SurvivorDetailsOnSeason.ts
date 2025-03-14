import { DataTypes, Model, Sequelize } from 'sequelize';
import { SurvivorsAttributes } from './Survivors';
import { SeasonsAttributes } from '../season/Seasons';
import { TribeAttributes } from '../season/Tribes';

export interface SurvivorDetailsOnSeasonAttributes {
  survivorId: SurvivorsAttributes['survivorId'];
  seasonId: SeasonsAttributes['seasonId'];
  originalTribeId: TribeAttributes['id'];
  age: number;
  description: string;
  job: string;
}

const SurvivorDetailsOnSeasonModel = (sequelize: Sequelize) => {
  class SurvivorDetailsOnSeason
    extends Model<SurvivorDetailsOnSeasonAttributes>
    implements SurvivorDetailsOnSeasonAttributes
  {
    public survivorId!: SurvivorDetailsOnSeasonAttributes['survivorId'];
    public seasonId!: SurvivorDetailsOnSeasonAttributes['seasonId'];
    public originalTribeId!: SurvivorDetailsOnSeasonAttributes['originalTribeId'];
    public age!: SurvivorDetailsOnSeasonAttributes['age'];
    public description!: SurvivorDetailsOnSeasonAttributes['description'];
    public job!: SurvivorDetailsOnSeasonAttributes['job'];

    static associate(models: any) {
      this.belongsTo(models.Survivors, {
        foreignKey: 'survivorId',
        targetKey: 'survivorId',
        as: 'Survivor',
      });
      this.belongsTo(models.Seasons, {
        foreignKey: 'seasonId',
        targetKey: 'seasonId',
        as: 'Season',
      });
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
