import { UUID } from 'crypto';
import { DataTypes, Model, Sequelize } from 'sequelize';
import { TribeAttributes } from './Tribes';
import { EpisodeAttributes } from './Episodes';
import logger from '../../config/logger';

export interface TribeMemberAttributes {
  tribeId: TribeAttributes['id'];
  episodeIdStart: EpisodeAttributes['episodeId']; //Episode the survivor started on the tribe.
  episodeIdEnd: UUID | null; //Episode the survivor was no longer part of the tribe
  survivorId: UUID;
  notes: string;
}

const TribeMembersModel = (sequelize: Sequelize) => {
  class TribeMember
    extends Model<TribeMemberAttributes>
    implements TribeMemberAttributes
  {
    public tribeId!: TribeMemberAttributes['tribeId'];
    public episodeIdStart!: TribeMemberAttributes['episodeIdStart'];
    public episodeIdEnd!: TribeMemberAttributes['episodeIdEnd'];
    public survivorId!: TribeMemberAttributes['survivorId'];
    public notes!: TribeMemberAttributes['notes'];

    static associate(models: any) {
      if (models.Tribe) {
        this.belongsTo(models.Tribe, {
          foreignKey: 'tribeId',
          targetKey: 'id',
          as: 'tribe',
        });
      } else {
        logger.error('Error associating TribeMember with Tribe');
      }

      if (models.Episode) {
        this.belongsTo(models.Episode, {
          foreignKey: 'episodeIdStart',
          targetKey: 'episodeId',
          as: 'episodeStarted',
        });
        this.belongsTo(models.Episode, {
          foreignKey: 'episodeIdEnd',
          targetKey: 'episodeId',
          as: 'episodeEnded',
        });
      } else {
        logger.error('Error associating TribeMember with Episode');
      }

      if (models.SurvivorDetailsOnSeason) {
        this.belongsTo(models.SurvivorDetailsOnSeason, {
          foreignKey: 'survivorId',
          targetKey: 'id',
          as: 'survivor',
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
        field: 'START_EPISODE_ID',
      },
      episodeIdEnd: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'END_EPISODE_ID',
      },
      survivorId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'SURVIVOR_ID',
      },
      notes: {
        type: DataTypes.STRING(1000),
        allowNull: true,
        field: 'NOTES',
      },
    },
    {
      sequelize,
      modelName: 'TribeMembers',
      tableName: 'TRIBE_MEMBERS',
      timestamps: false,
    }
  );
  return TribeMember;
};

export default TribeMembersModel;
