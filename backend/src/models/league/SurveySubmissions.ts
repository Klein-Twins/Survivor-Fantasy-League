import { UUID } from 'crypto';
import { LeagueProfileAttributes } from './LeagueProfile';
import { DataTypes, Model, Sequelize } from 'sequelize';
import { LeagueSurveyForEpisodeAttributes } from './LeagueSurveysForEpisode';

export interface SurveySubmissionAttributes {
  surveySubmissionId: UUID;
  leagueProfileId: LeagueProfileAttributes['id'];
  leagueSurveyId: LeagueSurveyForEpisodeAttributes['leagueSurveyId'];
}

const SurveySubmissionModel = (sequelize: Sequelize) => {
  class SurveySubmission
    extends Model<SurveySubmissionAttributes>
    implements SurveySubmissionAttributes
  {
    public surveySubmissionId!: SurveySubmissionAttributes['surveySubmissionId'];
    public leagueProfileId!: SurveySubmissionAttributes['leagueProfileId'];
    public leagueSurveyId!: SurveySubmissionAttributes['leagueSurveyId'];

    static associate(models: any) {}
  }
  SurveySubmission.init(
    {
      surveySubmissionId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        field: 'SURVEY_SUBMISSION_ID',
      },
      leagueProfileId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'LEAGUE_PROFILE_ID',
      },
      leagueSurveyId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'LEAGUE_SURVEY_ID',
      },
    },
    {
      sequelize,
      tableName: 'LGE_SURVEY_SUBMISSIONS',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: [
            'SURVEY_SUBMISSION_ID',
            'LEAGUE_PROFILE_ID',
            'LEAGUE_SURVEY_ID',
          ],
        },
      ],
    }
  );
  return SurveySubmission;
};

export default SurveySubmissionModel;
