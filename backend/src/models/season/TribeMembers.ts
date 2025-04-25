import { UUID } from 'crypto';
import { DataTypes, Model, Sequelize } from 'sequelize';
import { TribeAttributes } from './Tribes';
import { EpisodeAttributes } from './Episodes';
import logger from '../../config/logger';

export interface TribeMemberAttributes {
  tribeId: TribeAttributes['id'];
  episodeIdStart: EpisodeAttributes['id'];
  episodeIdEnd: EpisodeAttributes['id'] | null;
  survivorId: UUID;
  notes: string | null;
  isTribeSwitch?: boolean;
}

type MembershipType = 'START' | 'CHANGE';

const TribeMembersModel = (sequelize: Sequelize) => {
  class TribeMember
    extends Model<TribeMemberAttributes>
    implements TribeMemberAttributes
  {
    public tribeId!: TribeMemberAttributes['tribeId'];
    public episodeIdStart!: TribeMemberAttributes['episodeIdStart'];
    public episodeIdEnd!: TribeMemberAttributes['episodeIdEnd'];
    public survivorId!: TribeMemberAttributes['survivorId'];
    public notes!: string | null;
    public isTribeSwitch!: boolean;

    static associate(models: any) {
      if (models.Tribe) {
        this.belongsTo(models.Tribe, {
          foreignKey: 'tribeId',
          targetKey: 'id',
          as: 'tribe',
          onDelete: 'CASCADE',
        });
      } else {
        logger.error('Error associating TribeMember with Tribe');
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
        logger.error('Error associating TribeMember with Episode');
      }

      if (models.SurvivorDetailsOnSeason) {
        this.belongsTo(models.SurvivorDetailsOnSeason, {
          foreignKey: 'survivorId',
          targetKey: 'id',
          as: 'survivor',
          onDelete: 'CASCADE',
        });
      } else {
        logger.error(
          'Error associating TribeMember with SurvivorDetailsOnSeason'
        );
      }
    }
  }
  TribeMember.init(
    {
      tribeId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'TRIBE_ID',
      },
      episodeIdStart: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'EPISODE_ID_START',
      },
      episodeIdEnd: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'EPISODE_ID_END',
      },
      survivorId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'SURVIVOR_ID',
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'NOTES',
      },
      isTribeSwitch: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: 'IS_TRIBE_SWITCH',
        defaultValue: false,
      },
    },
    {
      sequelize,
      indexes: [
        {
          unique: true,
          fields: ['TRIBE_ID', 'EPISODE_ID_START', 'SURVIVOR_ID'],
        },
      ],
      modelName: 'TribeMembers',
      tableName: 'TRIBE_MEMBERS',
      timestamps: false,
    }
  );
  return TribeMember;
};

export default TribeMembersModel;
