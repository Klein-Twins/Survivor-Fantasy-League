import { DataTypes, Model, Sequelize } from "sequelize";

export interface LeagueProfileAttributes {
  profileId: string;
  leagueId: string;
  role: string;
}

const LeagueProfileModel = (sequelize: Sequelize) => {
  class LeagueProfile
    extends Model<LeagueProfileAttributes>
    implements LeagueProfileAttributes
  {
    public leagueId!: string;
    public profileId!: string;
    public role!: string;
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
