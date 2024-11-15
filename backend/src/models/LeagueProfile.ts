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
    // Fetch the original LeagueProfile record from the database
    const originalLeagueProfile = await LeagueProfile.findOne({
      where: { leagueId: leagueProfile.leagueId, profileId: leagueProfile.profileId }
    });

    if (!originalLeagueProfile) {
      throw new Error("League profile not found.");
    }

    // Check if the role is changing and whether the current role is 'Owner'
    if (leagueProfile.changed("role") && originalLeagueProfile.role === "Owner") {
      throw new Error("An Owner role cannot be changed.");
    }

    // Check if the role is being set to 'Owner', and there's already an Owner
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
