import { UUID } from 'crypto';
import { DataTypes, Model, Sequelize } from 'sequelize';
import { SeasonsAttributes } from './Seasons';
import logger from '../../config/logger';
import { EpisodeType } from '../../generated-api';

export interface EpisodeAttributes {
  episodeId: UUID;
  seasonId: SeasonsAttributes['seasonId'];
  episodeNumber: number;
  episodeTitle: string | null;
  episodeAirDate: Date;
  episodeDescription: string | null;
  episodeType: EpisodeType;
}

const EpisodeModel = (sequelize: Sequelize) => {
  class Episode extends Model<EpisodeAttributes> implements EpisodeAttributes {
    public episodeId!: EpisodeAttributes['episodeId'];
    public seasonId!: EpisodeAttributes['seasonId'];
    public episodeNumber!: EpisodeAttributes['episodeNumber'];
    public episodeTitle!: EpisodeAttributes['episodeTitle'] | null;
    public episodeAirDate!: EpisodeAttributes['episodeAirDate'];
    public episodeDescription!: EpisodeAttributes['episodeDescription'] | null;
    public episodeType!: EpisodeAttributes['episodeType'];

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
          sourceKey: 'episodeId',
          as: 'eliminations',
        });
      } else {
        logger.error('Error associating Episode with SeasonEliminations');
      }

      if (models.Challenges) {
        this.hasMany(models.Challenges, {
          foreignKey: 'episodeId',
          sourceKey: 'episodeId',
          as: 'challenges',
        });
      } else {
        logger.error('Error associating Episode with Challenges');
      }

      if (models.Tribe) {
        this.hasMany(models.Tribe, {
          foreignKey: 'episodeStarted',
          sourceKey: 'episodeNumber',
          as: 'tribe',
        });
      } else {
        logger.error('Error associating Episode with Tribe');
      }

      if (models.TribeMembers) {
        this.hasMany(models.TribeMembers, {
          foreignKey: 'episodeIdStart',
          sourceKey: 'episodeId',
          as: 'tribeMembersStarted',
        });
        this.hasMany(models.TribeMembers, {
          foreignKey: 'episodeIdEnd',
          sourceKey: 'episodeId',
          as: 'tribeMembersEnded',
        });
      } else {
        logger.error('Error associating Episode with TribeMembers');
      }

      if (models.EpisodeSurvey) {
        this.hasMany(models.EpisodeSurvey, {
          foreignKey: 'episodeId',
          sourceKey: 'episodeId',
          as: 'episodeSurvey',
        });
      } else {
        logger.error('Error associating Episode with EpisodeSurvey');
      }
    }
  }
  Episode.init(
    {
      episodeId: {
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
      episodeNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'EPISODE_NUMBER',
      },
      episodeTitle: {
        type: DataTypes.STRING(150),
        allowNull: true,
        field: 'EPISODE_TITLE',
      },
      episodeAirDate: {
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
      episodeDescription: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: 'EPISODE_DESCRIPTION',
      },
      episodeType: {
        type: DataTypes.ENUM(...Object.values(EpisodeType)),
        allowNull: false,
        field: 'EPISODE_TYPE',
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
