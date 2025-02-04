import { UUID } from 'crypto';
import { DataTypes, Model, Sequelize } from 'sequelize';
import { SurveyAttributes } from '../surveysAndPicks/Survey';
import { EpisodeAttributes } from '../season/Episodes';
import { LeagueAttributes } from './League';

/**
 * The purpose of this model is to tie surveyId's to leagues.
 */

export interface LeagueSurveyAttributes {
  leagueSurveyId: UUID;
  surveyId: SurveyAttributes['surveyId'];
  leagueId: LeagueAttributes['leagueId'];
  episodeId: EpisodeAttributes['episodeId'];
}

const LeagueSurveyModel = (sequelize: Sequelize) => {
  class LeagueSurvey extends Model<LeagueSurveyAttributes> implements LeagueSurveyAttributes {
    public leagueSurveyId!: LeagueSurveyAttributes['leagueSurveyId'];
    public surveyId!: LeagueSurveyAttributes['surveyId'];
    public leagueId!: LeagueSurveyAttributes['leagueId'];
    public episodeId!: LeagueSurveyAttributes['episodeId'];

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
      },
      leagueId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'LEAGUE_ID',
      },
      episodeId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'EPISODE_ID',
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
