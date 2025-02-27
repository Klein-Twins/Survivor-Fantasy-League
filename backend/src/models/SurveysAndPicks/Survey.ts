import { UUID } from 'crypto';
import { DataTypes, Model, Sequelize } from 'sequelize';

export interface SurveyAttributes {
  surveyId: UUID;
  name: string;
}

const SurveyModel = (sequelize: Sequelize) => {
  class Survey extends Model<SurveyAttributes> implements SurveyAttributes {
    public surveyId!: UUID;
    public name!: string;

    static associate(models: any) {
      //TODO: Add association to LGE_LEAGUE_SURVEYS
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
