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
    implements LeagueProfileAttributes
  {
    public leagueId!: string;
    public profileId!: string;
    public role!: string;
    public inviteStatus!: InviteStatusEnum;

    static associate(models: any) {
      this.belongsTo(models.League, {foreignKey: 'leagueId', as: 'league'});
      this.belongsTo(models.Profile, {foreignKey: 'profileId', as: 'profile'});
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
