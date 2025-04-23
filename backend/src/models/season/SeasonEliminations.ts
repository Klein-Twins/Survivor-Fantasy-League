import { DataTypes, Model, Sequelize } from 'sequelize';
import { SeasonsAttributes } from './Seasons';
import { EpisodeAttributes } from './Episodes';
import { SurvivorsAttributes } from '../survivors/Survivors';
import logger from '../../config/logger';
import { SurvivorEliminationType } from '../../generated-api';
import { TribalCouncilAttributes } from './tribalCouncil/TribalCouncil';

export interface SeasonEliminationTableAttributes {
  juryPlacement: number | null; //first jury member is 1 and last is 8 or null if not a jury member
  placement: number;
}

export interface SeasonEliminationDependencyAttributes {
  tribalCouncilId: TribalCouncilAttributes['id'];
  survivorId: SurvivorsAttributes['id'];
  seasonId: SeasonsAttributes['seasonId'];
}

export type SeasonEliminationAttributes = SeasonEliminationTableAttributes &
  SeasonEliminationDependencyAttributes;

// export interface SeasonEliminationAttributes {
//   seasonId: SeasonsAttributes['seasonId'];
//   episodeId: EpisodeAttributes['id'];
//   placement: number;
//   survivorId: SurvivorsAttributes['id'];
//   notes: string | null;
//   day: number;
//   seq: number;
//   juryPlacement: number | null; //first jury member is 1 and last is 8
//   type: SurvivorEliminationType;
// }

const SeasonEliminationsModel = (sequelize: Sequelize) => {
  class SeasonEliminations
    extends Model<SeasonEliminationAttributes>
    implements SeasonEliminationAttributes
  {
    public seasonId!: number;
    public tribalCouncilId!: SeasonEliminationAttributes['tribalCouncilId'];
    public survivorId!: SeasonEliminationAttributes['survivorId'];
    public placement!: SeasonEliminationAttributes['placement'];
    public juryPlacement!: SeasonEliminationAttributes['juryPlacement'];

    static associate(models: any) {
      if (models.SurvivorDetailsOnSeason) {
        this.belongsTo(models.SurvivorDetailsOnSeason, {
          foreignKey: 'survivorId',
          targetKey: 'id',
          as: 'eliminatedSurvivor',
          onDelete: 'CASCADE',
        });
      } else {
        logger.error(
          'Error associating SeasonEliminations with SurvivorDetailsOnSeason'
        );
      }
      if (models.TribalCouncils) {
        this.belongsTo(models.TribalCouncils, {
          foreignKey: 'tribalCouncilId',
          targetKey: 'id',
          as: 'tribalCouncil',
          onDelete: 'CASCADE',
        });
      } else {
        logger.error(
          'Error associating SeasonEliminations with TribalCouncils'
        );
      }
      if (models.Seasons) {
        this.belongsTo(models.Seasons, {
          foreignKey: 'seasonId',
          targetKey: 'seasonId',
          as: 'season',
          onDelete: 'CASCADE',
        });
      } else {
        logger.error('Error associating SeasonEliminations with Seasons');
      }
    }
  }

  SeasonEliminations.init(
    {
      tribalCouncilId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        field: 'TRIBAL_COUNCIL_ID',
      },
      survivorId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'ELIMINATED_SURVIVOR_ID',
      },
      placement: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'PLACEMENT',
      },
      juryPlacement: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'JURY_PLACEMENT',
        defaultValue: null,
      },
      seasonId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'SEASON_ID',
      },
    },
    {
      sequelize,
      tableName: 'SSN_ELIMINATIONS',
      timestamps: false,
    }
  );
  return SeasonEliminations;
};

export default SeasonEliminationsModel;
