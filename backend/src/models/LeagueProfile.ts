import { DataTypes, Model, Sequelize } from "sequelize";

export enum InviteStatusEnum {
  Pending = "pending",
  Accepted = "accepted",
}

export interface LeagueProfileAttributes {
  profileId: string;
  leagueId: string;
  role: string;
  inviteStatus: InviteStatusEnum;
  inviterProfileId: string | null;
}

const LeagueProfileModel = (sequelize: Sequelize) => {
  class LeagueProfile
    extends Model<LeagueProfileAttributes>
    implements LeagueProfileAttributes {
    public leagueId!: string;
    public profileId!: string;
    public inviterProfileId!: string | null;
    public role!: string;
    public inviteStatus!: InviteStatusEnum;

    static associate(models: any) {
      this.belongsTo(models.League, { foreignKey: 'leagueId', as: 'league' });
      this.belongsTo(models.Profile, { foreignKey: 'profileId', as: 'profile' });
    }
  }

  LeagueProfile.init(
    {
      profileId: {
        type: DataTypes.UUID,
        primaryKey: true,
        field: "PROFILE_ID"
      },
      leagueId: {
        type: DataTypes.UUID,
        primaryKey: true,
        field: "LEAGUE_ID"
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "ROLE"
      },
      inviteStatus: {
        type: DataTypes.ENUM(...Object.values(InviteStatusEnum)),
        allowNull: false,
        field: "INVITE_STATUS"
      },
      inviterProfileId: {
        type: DataTypes.UUID,
        primaryKey: false,
        allowNull: true,
        field: "INVITER_PROFILE_ID"
      }
    },
    {
      sequelize,
      tableName: "LGE_LEAGUES_PROFILES",
      timestamps: true,
      createdAt: "CREATED_AT",
      updatedAt: "UPDATED_AT",
      hooks: {
        // beforeCreate Hook: Enforce single Owner per league
        beforeCreate: async (leagueProfile: LeagueProfile, options) => {
          if (leagueProfile.role === "Owner") {
            const existingOwner = await LeagueProfile.findOne({
              where: {
                leagueId: leagueProfile.leagueId,
                role: "Owner",
              },
            });

            if (existingOwner) {
              throw new Error("A league can only have one Owner.");
            }
          }
        },

        // beforeUpdate Hook: Prevent updates to the Owner role
        beforeUpdate: async (leagueProfile: LeagueProfile, options) => {
          const originalLeagueProfile = await LeagueProfile.findOne({
            where: { leagueId: leagueProfile.leagueId, profileId: leagueProfile.profileId }
          });

          if (!originalLeagueProfile) {
            throw new Error("League profile not found.");
          }

          if (leagueProfile.changed("role") && originalLeagueProfile.role === "Owner") {
            throw new Error("An Owner role cannot be changed.");
          }

          if (leagueProfile.role === "Owner") {
            const existingOwner = await LeagueProfile.findOne({
              where: {
                leagueId: leagueProfile.leagueId,
                role: "Owner",
              },
            });

            if (existingOwner && existingOwner.profileId !== leagueProfile.profileId) {
              throw new Error("A league can only have one Owner.");
            }
          }
        }
      }
    }
  );

  return LeagueProfile;
};

export default LeagueProfileModel;
