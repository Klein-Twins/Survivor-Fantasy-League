import { DataTypes, Model, Sequelize } from 'sequelize';
import { ProfileAttributes } from '../account/Profile';
import { LeagueAttributes } from './League';
import { UUID } from 'crypto';
import logger from '../../config/logger';

export enum InviteStatus {
  Pending = 'pending',
  Accepted = 'accepted',
  Declined = 'declined',
}

export interface LeagueInviteAttributes {
  id: UUID;
  invitedProfileId: ProfileAttributes['profileId'];
  inviterProfileId: ProfileAttributes['profileId'];
  leagueId: LeagueAttributes['leagueId'];
  status: InviteStatus;
  message: string;
}

const LeagueInviteModel = (sequelize: Sequelize) => {
  class LeagueInvite
    extends Model<LeagueInviteAttributes>
    implements LeagueInviteAttributes
  {
    public id!: LeagueInviteAttributes['id'];
    public invitedProfileId!: LeagueInviteAttributes['invitedProfileId'];
    public inviterProfileId!: LeagueInviteAttributes['inviterProfileId'];
    public leagueId!: LeagueInviteAttributes['leagueId'];
    public status!: LeagueInviteAttributes['status'];
    public message!: LeagueInviteAttributes['message'];

    static associate(models: any) {
      if (models.League) {
        this.belongsTo(models.League, {
          foreignKey: 'leagueId',
          targetKey: 'leagueId',
          as: 'league',
          onDelete: 'CASCADE',
        });
      } else {
        logger.error('Error associating LeagueInvite with League');
      }
      if (models.Profile) {
        this.belongsTo(models.Profile, {
          foreignKey: 'invitedProfileId',
          targetKey: 'profileId',
          as: 'invitedProfile',
          onDelete: 'CASCADE',
        });
        this.belongsTo(models.Profile, {
          foreignKey: 'inviterProfileId',
          targetKey: 'profileId',
          as: 'inviterProfile',
          onDelete: 'CASCADE',
        });
      } else {
        logger.error('Error associating LeagueInvite with Profile');
      }
    }
  }
  LeagueInvite.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'INVITE_ID',
      },
      invitedProfileId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'INVITED_PROFILE_ID',
      },
      inviterProfileId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'INVITER_PROFILE_ID',
      },
      leagueId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'LEAGUE_ID',
      },
      status: {
        type: DataTypes.ENUM(...Object.values(InviteStatus)),
        defaultValue: InviteStatus.Pending,
        allowNull: false,
        field: 'INVITE_STATUS',
      },
      message: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'INVITE_MESSAGE',
      },
    },
    {
      sequelize,
      tableName: 'LGE_LEAGUE_INVITES',
      timestamps: true,
    }
  );
  return LeagueInvite;
};

export default LeagueInviteModel;
