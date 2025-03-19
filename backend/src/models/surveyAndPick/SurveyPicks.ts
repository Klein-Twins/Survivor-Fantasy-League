import { DataTypes, Model } from 'sequelize';
import { PicksAttributes } from './picks/Picks';
import { SurveyAttributes } from './Survey';
import logger from '../../config/logger';

export interface SurveyPicksAttributes {
  surveyId: SurveyAttributes['surveyId'];
  pickId: PicksAttributes['pickId'];
}

const SurveyPicksModel = (sequelize: any) => {
  class SurveyPicks
    extends Model<SurveyPicksAttributes>
    implements SurveyPicksAttributes
  {
    public surveyId!: SurveyPicksAttributes['surveyId'];
    public pickId!: SurveyPicksAttributes['pickId'];

    static associate(models: any) {
      if (models.Survey) {
        this.belongsTo(models.Survey, {
          foreignKey: 'surveyId',
          targetKey: 'surveyId',
          as: 'survey',
        });
      } else {
        logger.error('Error associating SurveyPicks with Survey');
      }

      if (models.Picks) {
        this.belongsTo(models.Picks, {
          foreignKey: 'pickId',
          targetKey: 'pickId',
          as: 'pick',
        });
      } else {
        logger.error('Error associating SurveyPicks with Picks');
      }
    }
  }
  SurveyPicks.init(
    {
      surveyId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        field: 'SURVEY_ID',
      },
      pickId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        field: 'PICK_ID',
      },
    },
    {
      sequelize,
      tableName: 'SUR_SURVEY_PICKS',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['SURVEY_ID', 'PICK_ID'],
        },
      ],
    }
  );
  return SurveyPicks;
};

export default SurveyPicksModel;
