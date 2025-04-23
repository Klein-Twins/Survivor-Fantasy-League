import { UUID } from 'crypto';
import { DataTypes, Model, Sequelize } from 'sequelize';
import { SeasonsAttributes } from './Seasons';
import { EpisodeAttributes } from './Episodes';
import logger from '../../config/logger';

export interface TribeTableAttributes {
  id: UUID;
  name: string;
  color: string;
  hexColor: string;
  mergeTribe: boolean;
}

export interface TribeDependencyAttributes {
  seasonId: SeasonsAttributes['seasonId'];
  episodeIdStart: EpisodeAttributes['id'];
  episodeIdEnd: EpisodeAttributes['id'] | null;
}

export type TribeAttributes = TribeTableAttributes & TribeDependencyAttributes;
export type TribeCreationAttributes = Omit<
  TribeAttributes,
  'episodeIdStart' | 'episodeIdEnd'
>;
// & {
//   episodeIdStart: null;
//   episodeIdEnd: null;
// };

const TribeModel = (sequelize: Sequelize) => {
  class Tribe extends Model<TribeAttributes> implements TribeAttributes {
    public id!: TribeAttributes['id'];
    public name!: TribeAttributes['name'];
    public seasonId!: TribeAttributes['seasonId'];
    public color!: TribeAttributes['color'];
    public hexColor!: TribeAttributes['hexColor'];
    public mergeTribe!: TribeAttributes['mergeTribe'];
    public episodeIdStart!: TribeAttributes['episodeIdStart'];
    public episodeIdEnd!: TribeAttributes['episodeIdEnd'];

    static associate(models: any) {
      if (models.Seasons) {
        this.belongsTo(models.Seasons, {
          foreignKey: 'seasonId',
          targetKey: 'seasonId',
          as: 'season',
          onDelete: 'CASCADE',
        });
      } else {
        logger.error('Error associating Tribe with Seasons');
      }
      if (models.ChallengeWinners) {
        this.hasMany(models.ChallengeWinners, {
          foreignKey: 'winnerTribeId',
          sourceKey: 'id',
          as: 'challengeWinners',
          onDelete: 'CASCADE',
        });
      } else {
        logger.error('Error associating Tribe with ChallengeWinners');
      }
      if (models.Episode) {
        this.belongsTo(models.Episode, {
          foreignKey: 'episodeIdStart',
          targetKey: 'id',
          as: 'episodeStarted',
          onDelete: 'CASCADE',
        });
        this.belongsTo(models.Episode, {
          foreignKey: 'episodeIdEnd',
          targetKey: 'id',
          as: 'episodeEnded',
          onDelete: 'CASCADE',
        });
      } else {
        logger.error('Error associating Tribe with Episode');
      }

      if (models.TribeMembers) {
        this.hasMany(models.TribeMembers, {
          foreignKey: 'tribeId',
          sourceKey: 'id',
          as: 'tribeMembers',
          onDelete: 'CASCADE',
        });
      } else {
        logger.error('Error associating Tribe with TribeMembers');
      }

      if (models.TribalCouncils) {
        this.hasMany(models.TribalCouncils, {
          foreignKey: 'attendingTribeId',
          sourceKey: 'id',
          as: 'tribalCouncils',
          onDelete: 'CASCADE',
        });
      } else {
        logger.error('Error associating Tribe with TribalCouncil');
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
      color: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: 'TRIBE_COLOR',
      },
      episodeIdStart: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'EPISODE_STARTED',
      },
      episodeIdEnd: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'EPISODE_ENDED',
        defaultValue: null,
      },
      hexColor: {
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
