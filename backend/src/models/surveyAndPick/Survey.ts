import { UUID } from 'crypto';
import { DataTypes, Model, Sequelize } from 'sequelize';
import logger from '../../config/logger';

export interface SurveyAttributes {
  surveyId: UUID;
  name: string;
}

const SurveyModel = (sequelize: Sequelize) => {
  class Survey extends Model<SurveyAttributes> implements SurveyAttributes {
    public surveyId!: UUID;
    public name!: string;

    static associate(models: any) {
      if (models.EpisodeSurvey) {
        this.hasMany(models.EpisodeSurvey, {
          foreignKey: 'surveyDefinition',
          sourceKey: 'surveyId',
          as: 'episodeSurvey',
          onDelete: 'CASCADE',
        });
      } else {
        logger.error('Error associating Survey with EpisodeSurvey');
      }

      if (models.SurveyPicks) {
        this.hasMany(models.SurveyPicks, {
          foreignKey: 'surveyId',
          sourceKey: 'surveyId',
          as: 'surveyPicks',
          onDelete: 'CASCADE',
        });
      } else {
        logger.error('Error associating Survey with SurveyPicks');
      }
    }
  }

  Survey.init(
    {
      surveyId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        field: 'SURVEY_ID',
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'NAME',
      },
    },
    {
      sequelize,
      tableName: 'SUR_SURVEY',
      timestamps: true,
    }
  );

  return Survey;
};

export default SurveyModel;
