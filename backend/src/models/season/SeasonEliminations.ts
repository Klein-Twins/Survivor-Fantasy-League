import { DataTypes, Model, Sequelize } from 'sequelize';
import { SeasonsAttributes } from './Seasons';
import { EpisodeAttributes } from './Episodes';
import { SurvivorsAttributes } from '../survivors/Survivors';

export interface SeasonEliminationAttributes {
  seasonId: SeasonsAttributes['seasonId'];
  episodeId: EpisodeAttributes['episodeId'];
  survivorId: SurvivorsAttributes['survivorId'];
  notes: string | null;
  seq: number;
}

const SeasonEliminationsModel = (sequelize: Sequelize) => {
  class SeasonEliminations extends Model<SeasonEliminationAttributes> implements SeasonEliminationAttributes {
    public seasonId!: SeasonEliminationAttributes['seasonId'];
    public episodeId!: SeasonEliminationAttributes['episodeId'];
    public survivorId!: SeasonEliminationAttributes['survivorId'];
    public notes!: SeasonEliminationAttributes['notes'];
    public seq!: SeasonEliminationAttributes['seq'];

    static associate(models: any) {
      //TODO - Add associations
      this.belongsTo(models.Seasons, {
        foreignKey: 'seasonId',
        targetKey: 'seasonId',
        as: 'season',
      });
      this.belongsTo(models.Episode, {
        foreignKey: 'episodeId',
        targetKey: 'episodeId',
        as: 'episode',
      });
      this.belongsTo(models.Survivors, {
        foreignKey: 'survivorId',
        targetKey: 'survivorId',
        as: 'survivor',
      });
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
      ],
    }
  );
  return SeasonEliminations;
};

export default SeasonEliminationsModel;
