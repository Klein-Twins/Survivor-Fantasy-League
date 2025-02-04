import { DataTypes, Model, Sequelize } from 'sequelize';
import { LeagueMemberRoleEnum } from '../../generated-api';
import { LeagueAttributes } from './League';
import { ProfileAttributes } from '../account/Profile';

export enum InviteStatusEnum {
  Pending = 'pending',
  Accepted = 'accepted',
}

export interface LeagueProfileAttributes {
  id: string;
  profileId: ProfileAttributes['profileId'];
  leagueId: LeagueAttributes['leagueId'];
  role: LeagueMemberRoleEnum;
  inviteStatus: InviteStatusEnum;
  inviterProfileId: ProfileAttributes['profileId'] | null;
}

const LeagueProfileModel = (sequelize: Sequelize) => {
  class LeagueProfile extends Model<LeagueProfileAttributes> implements LeagueProfileAttributes {
    public id!: LeagueProfileAttributes['id'];
    public leagueId!: LeagueProfileAttributes['leagueId'];
    public profileId!: LeagueProfileAttributes['profileId'];
    public inviterProfileId!: LeagueProfileAttributes['profileId'];
    public role!: LeagueProfileAttributes['role'];
    public inviteStatus!: LeagueProfileAttributes['inviteStatus'];

    static associate(models: any) {
      this.belongsTo(models.League, {
        foreignKey: 'leagueId',
        targetKey: 'leagueId',
        as: 'league',
      });
      this.belongsTo(models.Profile, {
        foreignKey: 'profileId',
        targetKey: 'profileId',
        as: 'profile',
      });
      // this.hasMany(models.ProfilePick, { foreignKey: 'leagueProfileId', as: 'profilePicks' });
    }
  }

  LeagueProfile.init(
    {
      profileId: {
        type: DataTypes.UUID,
        primaryKey: true,
        field: 'PROFILE_ID',
      },
      leagueId: {
        type: DataTypes.UUID,
        primaryKey: true,
        field: 'LEAGUE_ID',
      },
      role: {
        type: DataTypes.ENUM(...Object.values(LeagueMemberRoleEnum)),
        allowNull: false,
        field: 'ROLE',
      },
      inviteStatus: {
        type: DataTypes.ENUM(...Object.values(InviteStatusEnum)),
        allowNull: false,
        field: 'INVITE_STATUS',
      },
      inviterProfileId: {
        type: DataTypes.UUID,
        primaryKey: false,
        allowNull: true,
        field: 'INVITER_PROFILE_ID',
      },
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        field: 'ID',
      },
    },
    {
      sequelize,
      tableName: 'LGE_LEAGUES_PROFILES',
      timestamps: true,
      createdAt: 'CREATED_AT',
      updatedAt: 'UPDATED_AT',
      hooks: {
        // beforeCreate Hook: Enforce single Owner per league
        beforeCreate: async (leagueProfile: LeagueProfile, options) => {
          if (leagueProfile.role === LeagueMemberRoleEnum.OWNER) {
            const existingOwner = await LeagueProfile.findOne({
              where: {
                leagueId: leagueProfile.leagueId,
                role: 'OWNER',
              },
            });

            if (existingOwner) {
              throw new Error('A league can only have one Owner.');
            }
          }
        },

        // beforeUpdate Hook: Prevent updates to the Owner role
        beforeUpdate: async (leagueProfile: LeagueProfile, options) => {
          const originalLeagueProfile = await LeagueProfile.findOne({
            where: { leagueId: leagueProfile.leagueId, profileId: leagueProfile.profileId },
          });

          if (!originalLeagueProfile) {
            throw new Error('League profile not found.');
          }

          if (leagueProfile.changed('role') && originalLeagueProfile.role === LeagueMemberRoleEnum.OWNER) {
            throw new Error('An Owner role cannot be changed.');
          }

          if (leagueProfile.role === LeagueMemberRoleEnum.OWNER) {
            const existingOwner = await LeagueProfile.findOne({
              where: {
                leagueId: leagueProfile.leagueId,
                role: 'OWNER',
              },
            });

            if (existingOwner && existingOwner.profileId !== leagueProfile.profileId) {
              throw new Error('A league can only have one Owner.');
            }
          }
        },
      },
    }
  );

  return LeagueProfile;
};

export default LeagueProfileModel;
