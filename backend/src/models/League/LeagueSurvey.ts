import { UUID } from 'crypto';
import { DataTypes, Model, Sequelize } from 'sequelize';

/**
 * The purpose of this model is to tie surveyId's to leagues.
 */

export interface LeagueSurveyAttributes {
  leagueSurveyId: UUID;
  surveyId: UUID;
  leagueId: UUID;
  episodeId: UUID;
}

const LeagueSurveyModel = (sequelize: Sequelize) => {
  class LeagueSurvey extends Model<LeagueSurveyAttributes> implements LeagueSurveyAttributes {
    public leagueSurveyId!: UUID;
    public surveyId!: UUID;
    public leagueId!: UUID;
    public episodeId!: UUID;

    static associate(models: any) {
      //TODO: Add associations
      // this.belongsTo(models.Survey, { foreignKey: 'surveyId', as: 'survey' });
      // this.belongsTo(models.League, { foreignKey: 'leagueId', as: 'league' });
      // this.belongsTo(models.Episode, { foreignKey: 'episodeId', as: 'episode' });
    }
  }

  LeagueSurvey.init(
    {
      leagueSurveyId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUID,
        field: 'LEAGUE_SURVEY_ID',
      },
      surveyId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'SURVEY_ID',
        //TODO: Add foreign key constraint
      },
      leagueId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'LEAGUE_ID',
        //TODO: Add foreign key constraint
      },
      episodeId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'EPISODE_ID',
        //TODO: Add foreign key constraint
      },
    },
    {
      sequelize,
      tableName: 'LGE_LEAGUE_SURVEYS',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['LEAGUE_ID', 'EPISODE_ID'],
        },
      ],
    }
  );

  return LeagueSurvey;
};

export default LeagueSurveyModel;
