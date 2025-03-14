import { UUID } from 'crypto';
import { LeagueProfileAttributes } from './LeagueProfile';
import { PicksAttributes } from '../surveyAndPick/picks/Picks';
import { PickPointsAttributes } from '../surveyAndPick/picks/PickPoints';
import { LeagueSurveyAttributes } from './LeagueSurveys';
import { SurvivorsAttributes } from '../survivors/Survivors';
import { TribeAttributes } from '../season/Tribes';
import { PickOptionTypeEnum } from '../../generated-api';
import { DataTypes, Model, Sequelize } from 'sequelize';
import { validate as uuidValidate } from 'uuid';

export interface PickSubmissionAttributes {
  surveySubmissionId: UUID;
  pickId: PicksAttributes['pickId'];
  playerChoice:
    | SurvivorsAttributes['survivorId']
    | TribeAttributes['id']
    | PickOptionTypeEnum
    | string;
  pointsEarned: PickPointsAttributes['points'] | null;
}

const PickSubmissionModel = (sequelize: Sequelize) => {
  class PickSubmission
    extends Model<PickSubmissionAttributes>
    implements PickSubmissionAttributes
  {
    public surveySubmissionId!: PickSubmissionAttributes['surveySubmissionId'];
    public playerChoice!: PickSubmissionAttributes['playerChoice'];
    public pickId!: PickSubmissionAttributes['pickId'];
    public pointsEarned!: PickSubmissionAttributes['pointsEarned'];

    static associate(models: any) {}
  }
  PickSubmission.init(
    {
      surveySubmissionId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        field: 'SURVEY_SUBMISSION_ID',
      },
      pickId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'PICK_ID',
      },
      playerChoice: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'PLAYER_CHOICE',
        // validate: {
        //   isValidChoice(value: string) {
        //     const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        //     const validChoices = ['true', 'false', 'yes', 'no'];
        //     if (
        //       !uuidValidate(value) &&
        //       !validChoices.includes(value) &&
        //       !hexColorRegex.test(value)
        //     ) {
        //       throw new Error(
        //         'PLAYER_CHOICE must be a valid UUID or a valid string choice or hex color'
        //       );
        //     }
        //   },
        // },
      },
      pointsEarned: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'POINTS_EARNED',
      },
    },
    {
      sequelize,
      tableName: 'LGE_SURVEY_PICK_SUBMISSIONS',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['PICK_ID', 'SURVEY_SUBMISSION_ID'],
        },
      ],
    }
  );
  return PickSubmission;
};

export default PickSubmissionModel;
