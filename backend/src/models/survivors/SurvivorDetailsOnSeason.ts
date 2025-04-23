import { DataTypes, Model, Sequelize } from 'sequelize';
import { SurvivorsAttributes } from './Survivors';
import { SeasonsAttributes } from '../season/Seasons';
import { TribeAttributes } from '../season/Tribes';
import logger from '../../config/logger';

export interface SurvivorDetailsOnSeasonDependenciesAttributes {
  id: SurvivorsAttributes['id'];
  seasonId: SeasonsAttributes['seasonId'];
}

export interface SurvivorDetailsOnSeasonTableAttributes {
  age: number;
  description: string;
  job: string;
}

export type SurvivorDetailsOnSeasonAttributes =
  SurvivorDetailsOnSeasonTableAttributes &
    SurvivorDetailsOnSeasonDependenciesAttributes;

const SurvivorDetailsOnSeasonModel = (sequelize: Sequelize) => {
  class SurvivorDetailsOnSeason
    extends Model<SurvivorDetailsOnSeasonAttributes>
    implements SurvivorDetailsOnSeasonAttributes
  {
    public id!: SurvivorDetailsOnSeasonAttributes['id'];
    public seasonId!: SurvivorDetailsOnSeasonAttributes['seasonId'];
    public age!: SurvivorDetailsOnSeasonAttributes['age'];
    public description!: SurvivorDetailsOnSeasonAttributes['description'];
    public job!: SurvivorDetailsOnSeasonAttributes['job'];

    static associate(models: any) {
      if (models.Survivors) {
        this.belongsTo(models.Survivors, {
          foreignKey: 'id',
          targetKey: 'id',
          as: 'Survivor',
          onDelete: 'CASCADE',
        });
      } else {
        logger.error(
          'Error associating SurvivorDetailsOnSeason with Survivors'
        );
      }
      if (models.Seasons) {
        this.belongsTo(models.Seasons, {
          foreignKey: 'seasonId',
          targetKey: 'seasonId',
          as: 'Season',
          onDelete: 'CASCADE',
        });
      } else {
        logger.error('Error associating SurvivorDetailsOnSeason with Seasons');
      }
      if (models.SeasonEliminations) {
        this.hasMany(models.SeasonEliminations, {
          foreignKey: 'survivorId',
          sourceKey: 'id',
          as: 'eliminations',
          onDelete: 'CASCADE',
        });
      } else {
        logger.error(
          'Error associating SurvivorDetailsOnSeason with SeasonEliminations'
        );
      }
      if (models.ChallengeWinners) {
        this.hasMany(models.ChallengeWinners, {
          foreignKey: 'winnerSurvivorId',
          sourceKey: 'id',
          as: 'challengeWins',
          onDelete: 'CASCADE',
        });
      } else {
        logger.error(
          'Error associating SurvivorDetailsOnSeason with ChallengeWinners'
        );
      }
      if (models.TribeMembers) {
        this.hasMany(models.TribeMembers, {
          foreignKey: 'survivorId',
          sourceKey: 'id',
          as: 'tribe',
          onDelete: 'CASCADE',
        });
      } else {
        logger.error(
          'Error associating SurvivorDetailsOnSeason with TribeMembers'
        );
      }
      if (models.TribalCouncilSurvivors) {
        this.hasMany(models.TribalCouncilSurvivors, {
          foreignKey: 'survivorId',
          sourceKey: 'id',
          as: 'tribalCouncilSurvivors',
          onDelete: 'CASCADE',
        });
      } else {
        logger.error(
          'Error associating SurvivorDetailsOnSeason with TribalCouncilSurvivors'
        );
      }
    }
  }

  SurvivorDetailsOnSeason.init(
    {
      id: {
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
