import { UUID } from 'crypto';
import { DataTypes, Model, Sequelize } from 'sequelize';
import { SeasonsAttributes } from './Seasons';
import { EpisodeAttributes } from './Episodes';
import logger from '../../config/logger';

export interface TribeAttributes {
  id: UUID | string;
  name: string;
  seasonId: SeasonsAttributes['seasonId'];
  tribeColor: string;
  mergeTribe: boolean;
  episodeStarted: EpisodeAttributes['episodeId'];
  tribeHexColor: string;
}

const TribeModel = (sequelize: Sequelize) => {
  class Tribe extends Model<TribeAttributes> implements TribeAttributes {
    public id!: TribeAttributes['id'];
    public name!: TribeAttributes['name'];
    public seasonId!: TribeAttributes['seasonId'];
    public tribeColor!: TribeAttributes['tribeColor'];
    public tribeHexColor!: TribeAttributes['tribeHexColor'];
    public mergeTribe!: TribeAttributes['mergeTribe'];
    public episodeStarted!: EpisodeAttributes['episodeId'];

    static associate(models: any) {
      if (models.Seasons) {
        this.belongsTo(models.Seasons, {
          foreignKey: 'seasonId',
          targetKey: 'seasonId',
          as: 'season',
        });
      } else {
        logger.error('Error associating Tribe with Seasons');
      }
      if (models.ChallengeWinners) {
        this.hasMany(models.ChallengeWinners, {
          foreignKey: 'winnerTribeId',
          sourceKey: 'id',
          as: 'challengeWinners',
        });
      } else {
        logger.error('Error associating Tribe with ChallengeWinners');
      }
      if (models.Episode) {
        this.belongsTo(models.Episode, {
          foreignKey: 'episodeStarted',
          targetKey: 'episodeId',
          as: 'episode',
        });
      } else {
        logger.error('Error associating Tribe with Episode');
      }

      if (models.TribeMembers) {
        this.hasMany(models.TribeMembers, {
          foreignKey: 'tribeId',
          sourceKey: 'id',
          as: 'tribeMembers',
        });
      } else {
        logger.error('Error associating Tribe with TribeMembers');
      }
    }
  }

  Tribe.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        field: 'TRIBE_ID',
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'TRIBE_NAME',
      },
      seasonId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'SEASON_ID',
      },
      mergeTribe: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: 'MERGE_TRIBE',
      },
      tribeColor: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: 'TRIBE_COLOR',
      },
      episodeStarted: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'EPISODE_STARTED',
      },
      tribeHexColor: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: 'TRIBE_HEX_COLOR',
        validate: {
          //If tribeHexColor is not a valid hex color, throw an error
          isHexColor(value: string) {
            if (!/^#([A-Fa-f0-9]{6})$/.test(value)) {
              throw new Error('Invalid hex color');
            }
          },
        },
      },
    },
    {
      sequelize,
      tableName: 'SSN_TRIBES',
      timestamps: true,
    }
  );

  return Tribe;
};

export default TribeModel;
