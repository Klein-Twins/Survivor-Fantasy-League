import { DataTypes, Model, Sequelize } from 'sequelize';
import { SeasonsAttributes } from '../season/Seasons';
import logger from '../../config/logger';

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
      if (models.Seasons) {
        this.belongsTo(models.Seasons, {
          foreignKey: 'seasonId',
          targetKey: 'seasonId',
          as: 'season',
          onDelete: 'CASCADE',
        });
      } else {
        logger.error('Error associating League with Seasons');
      }
      if (models.LeagueProfile) {
        this.hasMany(models.LeagueProfile, {
          foreignKey: 'leagueId',
          sourceKey: 'leagueId',
          as: 'leagueProfiles',
          onDelete: 'CASCADE',
        });
      } else {
        logger.error('Error associating League with LeagueProfile');
      }
      if (models.LeagueSurveyForEpisode) {
        this.hasMany(models.LeagueSurveyForEpisode, {
          foreignKey: 'leagueId',
          sourceKey: 'leagueId',
          as: 'leagueSurveys',
          onDelete: 'CASCADE',
        });
      } else {
        logger.error('Error associating League with LeagueSurveyForEpisode');
      }
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
