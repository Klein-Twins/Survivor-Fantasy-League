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
}

const LeagueProfileModel = (sequelize: Sequelize) => {
  class LeagueProfile
    extends Model<LeagueProfileAttributes>
    implements LeagueProfileAttributes {
    public leagueId!: string;
    public profileId!: string;
    public role!: string;
    public inviteStatus!: InviteStatusEnum;

    static associate(models: any) {
      this.belongsTo(models.League, { foreignKey: 'leagueId', as: 'league' });
      this.belongsTo(models.Profile, { foreignKey: 'profileId', as: 'profile' });
    }
  }

  // beforeCreate Hook: Enforce single Owner per league
  LeagueProfile.addHook("beforeCreate", async (leagueProfile: LeagueProfile, options) => {
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
  });

  // beforeUpdate Hook: Prevent updates to the Owner role
  LeagueProfile.addHook("beforeUpdate", async (leagueProfile: LeagueProfile, options) => {
    if (leagueProfile.changed("role") && leagueProfile.role === "Owner") {
      // Prevent the change if the role is being updated to Owner, and there's already an owner in the league
      const existingOwner = await LeagueProfile.findOne({
        where: {
          leagueId: leagueProfile.leagueId,
          role: "Owner",
        },
      });

      if (existingOwner && existingOwner.profileId !== leagueProfile.profileId) {
        throw new Error("A league can only have one Owner, and this profile is not allowed to change to Owner.");
      }
    }
  });

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
      }
    },
    {
      sequelize,
      tableName: "LGE_LEAGUES_PROFILES",
      timestamps: true,
      createdAt: "CREATED_AT",
      updatedAt: "UPDATED_AT",
    }
  );

  return LeagueProfile;
};

export default LeagueProfileModel;
