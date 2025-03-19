import { DataTypes, Model, Sequelize } from 'sequelize';

import { ProfileAttributes } from '../account/Profile';
import { LeagueAttributes } from './League';
import { LeagueMemberRole } from '../../generated-api';
import logger from '../../config/logger';

export enum InviteStatus {
  Pending = 'pending',
  Accepted = 'accepted',
}

export interface LeagueProfileAttributes {
  id: string;
  profileId: ProfileAttributes['profileId'];
  leagueId: LeagueAttributes['leagueId'];
  role: LeagueMemberRole;
  inviteStatus: InviteStatus;
  inviterProfileId: ProfileAttributes['profileId'] | null;
}

const LeagueProfileModel = (sequelize: Sequelize) => {
  class LeagueProfile
    extends Model<LeagueProfileAttributes>
    implements LeagueProfileAttributes
  {
    public id!: LeagueProfileAttributes['id'];
    public leagueId!: LeagueProfileAttributes['leagueId'];
    public profileId!: LeagueProfileAttributes['profileId'];
    public inviterProfileId!: LeagueProfileAttributes['profileId'];
    public role!: LeagueProfileAttributes['role'];
    public inviteStatus!: LeagueProfileAttributes['inviteStatus'];

    static associate(models: any) {
      if (models.League) {
        this.belongsTo(models.League, {
          foreignKey: 'leagueId',
          targetKey: 'leagueId',
          as: 'league',
        });
      } else {
        logger.error('Error associating LeagueProfile with Profile');
      }
      if (models.Profile) {
        this.belongsTo(models.Profile, {
          foreignKey: 'profileId',
          targetKey: 'profileId',
          as: 'profile',
        });
        this.belongsTo(models.Profile, {
          foreignKey: 'inviterProfileId',
          targetKey: 'profileId',
          as: 'inviterProfile',
        });
      } else {
        logger.error('Error associating LeagueProfile with Profile');
      }
      if (models.SurveySubmissions) {
        this.hasMany(models.SurveySubmissions, {
          foreignKey: 'leagueProfileId',
          sourceKey: 'id',
          as: 'surveySubmissions',
        });
      } else {
        logger.error('Error associating LeagueProfile with SurveySubmissions');
      }
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
        type: DataTypes.ENUM(...Object.values(LeagueMemberRole)),
        allowNull: false,
        field: 'ROLE',
      },
      inviteStatus: {
        type: DataTypes.ENUM(...Object.values(InviteStatus)),
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
          if (leagueProfile.role === LeagueMemberRole.Owner) {
            const existingOwner = await LeagueProfile.findOne({
              where: {
                leagueId: leagueProfile.leagueId,
                role: 'Owner',
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
            where: {
              leagueId: leagueProfile.leagueId,
              profileId: leagueProfile.profileId,
            },
          });

          if (!originalLeagueProfile) {
            throw new Error('League profile not found.');
          }

          if (
            leagueProfile.changed('role') &&
            originalLeagueProfile.role === LeagueMemberRole.Owner
          ) {
            throw new Error('An Owner role cannot be changed.');
          }

          if (leagueProfile.role === LeagueMemberRole.Owner) {
            const existingOwner = await LeagueProfile.findOne({
              where: {
                leagueId: leagueProfile.leagueId,
                role: 'Owner',
              },
            });

            if (
              existingOwner &&
              existingOwner.profileId !== leagueProfile.profileId
            ) {
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
