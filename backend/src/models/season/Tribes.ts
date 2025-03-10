import { UUID } from 'crypto';
import { DataTypes, Model, Sequelize } from 'sequelize';
import { SeasonsAttributes } from './Seasons';
import { EpisodeAttributes } from './Episodes';

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
      this.belongsTo(models.Seasons, {
        foreignKey: 'seasonId',
        targetKey: 'seasonId',
        as: 'season',
      });
      // this.hasMany(models.ProfilePick, {
      //   foreignKey: 'pickAnswerTribeId',
      //   sourceKey: 'id',
      //   as: 'profilePicks',
      // });

      this.hasMany(models.ChallengeWinners, {
        foreignKey: 'winnerTribeId',
        sourceKey: 'id',
        as: 'challengeWinners',
      });
      this.belongsTo(models.Episode, {
        foreignKey: 'episodeStarted',
        targetKey: 'episodeId',
        as: 'episode',
      });
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
