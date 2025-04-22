import { UUID } from 'crypto';
import { LeagueProfileAttributes } from './LeagueProfile';
import { DataTypes, Model, Sequelize } from 'sequelize';
import { LeagueSurveyForEpisodeAttributes } from './LeagueSurveysForEpisode';
import logger from '../../config/logger';

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

    static associate(models: any) {
      if (models.PickSubmissions) {
        this.hasMany(models.PickSubmissions, {
          foreignKey: 'surveySubmissionId',
          sourceKey: 'surveySubmissionId',
          as: 'pickSubmissions',
          onDelete: 'CASCADE',
        });
      } else {
        logger.error('Error associating SurveySubmission with PickSubmissions');
      }
      if (models.LeagueProfile) {
        this.belongsTo(models.LeagueProfile, {
          foreignKey: 'leagueProfileId',
          targetKey: 'id',
          as: 'leagueProfile',
          onDelete: 'CASCADE',
        });
      } else {
        logger.error('Error associating SurveySubmission with LeagueProfile');
      }
      if (models.LeagueSurveyForEpisode) {
        this.belongsTo(models.LeagueSurveyForEpisode, {
          foreignKey: 'leagueSurveyId',
          targetKey: 'leagueSurveyId',
          as: 'leagueSurvey',
          onDelete: 'CASCADE',
        });
      } else {
        logger.error(
          'Error associating SurveySubmission with LeagueSurveyForEpisode'
        );
      }
    }
  }
  SurveySubmission.init(
    {
      surveySubmissionId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
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
          fields: ['LEAGUE_PROFILE_ID', 'LEAGUE_SURVEY_ID'],
        },
      ],
    }
  );
  return SurveySubmission;
};

export default SurveySubmissionModel;
