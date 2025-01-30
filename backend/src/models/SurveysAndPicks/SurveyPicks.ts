import { UUID } from 'crypto';
import { DataTypes, Model } from 'sequelize';

export interface SurveyPicksAttributes {
  surveyId: UUID;
  pickId: UUID;
}

const SurveyPicksModel = (sequelize: any) => {
  class SurveyPicks extends Model<SurveyPicksAttributes> implements SurveyPicksAttributes {
    public surveyId!: UUID;
    public pickId!: UUID;

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
          fields: [''],
        },
      ],
    }
  );
};
