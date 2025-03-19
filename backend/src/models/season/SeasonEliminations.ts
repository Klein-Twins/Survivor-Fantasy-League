import { DataTypes, Model, Sequelize } from 'sequelize';
import { SeasonsAttributes } from './Seasons';
import { EpisodeAttributes } from './Episodes';
import { SurvivorsAttributes } from '../survivors/Survivors';
import logger from '../../config/logger';

export interface SeasonEliminationAttributes {
  seasonId: SeasonsAttributes['seasonId'];
  episodeId: EpisodeAttributes['episodeId'];
  placement: number;
  survivorId: SurvivorsAttributes['id'];
  notes: string | null;
  day: number;
  seq: number;
}

const SeasonEliminationsModel = (sequelize: Sequelize) => {
  class SeasonEliminations
    extends Model<SeasonEliminationAttributes>
    implements SeasonEliminationAttributes
  {
    public seasonId!: SeasonEliminationAttributes['seasonId'];
    public episodeId!: SeasonEliminationAttributes['episodeId'];
    public day!: SeasonEliminationAttributes['day'];
    public survivorId!: SeasonEliminationAttributes['survivorId'];
    public notes!: SeasonEliminationAttributes['notes'];
    public seq!: SeasonEliminationAttributes['seq'];
    public placement!: SeasonEliminationAttributes['placement'];

    static associate(models: any) {
      //TODO - Add associations
      if (models.Seasons) {
        this.belongsTo(models.Seasons, {
          foreignKey: 'seasonId',
          targetKey: 'seasonId',
          as: 'season',
        });
      } else {
        logger.error('Error associating SeasonEliminations with Seasons');
      }
      if (models.Episode) {
        this.belongsTo(models.Episode, {
          foreignKey: 'episodeId',
          targetKey: 'episodeId',
          as: 'episode',
        });
      } else {
        logger.error('Error associating SeasonEliminations with Episode');
      }
      if (models.SurvivorDetailsOnSeason) {
        this.belongsTo(models.SurvivorDetailsOnSeason, {
          foreignKey: 'survivorId',
          targetKey: 'id',
          as: 'survivor',
        });
      } else {
        logger.error(
          'Error associating SeasonEliminations with SurvivorDetailsOnSeason'
        );
      }
    }
  }

  SeasonEliminations.init(
    {
      seasonId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'SSN_SEASONS',
          key: 'SEASON_ID',
        },
        field: 'SEASON_ID',
      },
      episodeId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'SSN_EPISODES',
          key: 'EPISODE_ID',
        },
        field: 'EPISODE_ID',
      },
      day: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'DAY',
      },
      survivorId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'CST_SURVIVORS',
          key: 'SURVIVOR_ID',
        },
        field: 'SURVIVOR_ID',
      },
      notes: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: 'NOTES',
      },
      seq: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'SEQ',
      },
      placement: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'PLACEMENT',
      },
    },
    {
      sequelize,
      tableName: 'SSN_ELIMINATIONS',
      timestamps: false,
      indexes: [
        {
          fields: ['SEASON_ID', 'EPISODE_ID', 'SURVIVOR_ID'],
          unique: true,
          name: 'ssn_eliminations_pk',
        },
        {
          fields: ['SEASON_ID', 'PLACEMENT'],
          unique: true,
          name: 'ssn_eliminations_season_placement_uk',
        },
      ],
    }
  );
  return SeasonEliminations;
};

export default SeasonEliminationsModel;
