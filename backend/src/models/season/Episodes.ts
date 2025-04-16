import { UUID } from 'crypto';
import { DataTypes, Model, Sequelize } from 'sequelize';
import { SeasonsAttributes } from './Seasons';
import logger from '../../config/logger';
import { EpisodeType } from '../../generated-api';

export interface EpisodeAttributes {
  id: UUID;
  seasonId: SeasonsAttributes['seasonId'];
  number: number;
  title: string | null;
  airDate: Date;
  description: string | null;
  type: EpisodeType;
  isTribeSwitch?: boolean;
}

const EpisodeModel = (sequelize: Sequelize) => {
  class Episode extends Model<EpisodeAttributes> implements EpisodeAttributes {
    public id!: EpisodeAttributes['id'];
    public seasonId!: EpisodeAttributes['seasonId'];
    public number!: EpisodeAttributes['number'];
    public title!: EpisodeAttributes['title'] | null;
    public airDate!: EpisodeAttributes['airDate'];
    public description!: EpisodeAttributes['description'] | null;
    public type!: EpisodeAttributes['type'];
    public isTribeSwitch!: EpisodeAttributes['isTribeSwitch'];

    static associate(models: any) {
      if (models.Seasons) {
        this.belongsTo(models.Seasons, {
          foreignKey: 'seasonId',
          targetKey: 'seasonId',
          as: 'season',
        });
      } else {
        logger.error('Error associating Episode with Seasons');
      }

      if (models.SeasonEliminations) {
        this.hasMany(models.SeasonEliminations, {
          foreignKey: 'episodeId',
          sourceKey: 'id',
          as: 'eliminations',
        });
      } else {
        logger.error('Error associating Episode with SeasonEliminations');
      }

      if (models.Challenges) {
        this.hasMany(models.Challenges, {
          foreignKey: 'episodeId',
          sourceKey: 'id',
          as: 'challenges',
        });
      } else {
        logger.error('Error associating Episode with Challenges');
      }

      if (models.Tribe) {
        this.hasMany(models.Tribe, {
          foreignKey: 'episodeIdStart',
          sourceKey: 'id',
          as: 'tribeStarted',
        });
        this.hasMany(models.Tribe, {
          foreignKey: 'episodeIdEnd',
          sourceKey: 'id',
          as: 'tribeEnded',
        });
      } else {
        logger.error('Error associating Episode with Tribe');
      }

      if (models.TribeMembers) {
        this.hasMany(models.TribeMembers, {
          foreignKey: 'episodeId',
          sourceKey: 'id',
          as: 'tribeMembersOnEpisode',
        });
      } else {
        logger.error('Error associating Episode with TribeMembers');
      }

      if (models.EpisodeSurvey) {
        this.hasMany(models.EpisodeSurvey, {
          foreignKey: 'episodeId',
          sourceKey: 'id',
          as: 'episodeSurvey',
        });
      } else {
        logger.error('Error associating Episode with EpisodeSurvey');
      }

      if (models.PickSolutions) {
        this.hasMany(models.PickSolutions, {
          foreignKey: 'episodeId',
          sourceKey: 'id',
          as: 'picksFulfilled',
        });
      } else {
        logger.error('Error associating Episode with PickSolutions');
      }
    }
  }
  Episode.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        field: 'EPISODE_ID',
      },
      seasonId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'SEASON_ID',
      },
      number: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'EPISODE_NUMBER',
      },
      title: {
        type: DataTypes.STRING(150),
        allowNull: true,
        field: 'EPISODE_TITLE',
      },
      airDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'EPISODE_AIR_DATE',
        // get() {
        //   const rawValue = this.getDataValue('episodeAirDate');
        //   return rawValue ? new Date(rawValue) : null;
        // },
        // set(value: Date | string) {
        //   this.setDataValue('episodeAirDate', new Date(value));
        // },
      },
      description: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: 'EPISODE_DESCRIPTION',
      },
      type: {
        type: DataTypes.ENUM(...Object.values(EpisodeType)),
        allowNull: false,
        field: 'EPISODE_TYPE',
      },
      isTribeSwitch: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'IS_TRIBE_SWITCH',
      },
    },
    {
      sequelize,
      tableName: 'SSN_EPISODES',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['SEASON_ID', 'EPISODE_NUMBER'],
        },
      ],
    }
  );

  return Episode;
};

export default EpisodeModel;
