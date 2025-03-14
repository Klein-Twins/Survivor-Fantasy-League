import { UUID } from 'crypto';
import { DataTypes, Model } from 'sequelize';
import { PicksAttributes } from './picks/Picks';
import { SurveyAttributes } from './Survey';

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
      //TODO: Add association to LGE_LEAGUE_SURVEYS
      //TODO: Add association to PCK_PICKS
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
