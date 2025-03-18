import { DataTypes, Model, Sequelize } from 'sequelize';
import { SeasonsAttributes } from '../season/Seasons';

export interface LeagueAttributes {
  leagueId: string;
  seasonId: SeasonsAttributes['seasonId'];
  name: string;
  createdAt?: Date;
}

const LeagueModel = (sequelize: Sequelize) => {
  class League extends Model<LeagueAttributes> implements LeagueAttributes {
    public leagueId!: LeagueAttributes['leagueId'];
    public seasonId!: LeagueAttributes['seasonId'];
    public name!: LeagueAttributes['name'];

    static associate(models: any) {
      this.belongsTo(models.Seasons, {
        foreignKey: 'seasonId',
        targetKey: 'seasonId',
        as: 'season',
      });
      this.hasMany(models.LeagueProfile, {
        foreignKey: 'leagueId',
        sourceKey: 'leagueId',
        as: 'leagueProfiles',
      });
    }
  }

  League.init(
    {
      leagueId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        field: 'LEAGUE_ID',
      },
      seasonId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'SEASON_ID',
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'NAME',
      },
    },
    {
      sequelize,
      tableName: 'LGE_LEAGUE',
      timestamps: true,
    }
  );

  return League;
};

export default LeagueModel;
