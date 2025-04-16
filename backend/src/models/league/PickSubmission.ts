import { UUID } from 'crypto';
import { PicksAttributes } from '../surveyAndPick/picks/Picks';
import { PickPointsAttributes } from '../surveyAndPick/picks/PickPoints';
import { SurvivorsAttributes } from '../survivors/Survivors';
import { TribeAttributes } from '../season/Tribes';
import { PickOptionTypeEnum } from '../../generated-api';
import { DataTypes, Model, Sequelize } from 'sequelize';
import logger from '../../config/logger';

export enum PickSubmissionStatus {
  PENDING = 'PENDING',
  CORRECT = 'CORRECT',
  INCORRECT = 'INCORRECT',
}

export interface PickSubmissionAttributes {
  surveySubmissionId: UUID;
  pickId: PicksAttributes['pickId'];
  playerChoice:
    | SurvivorsAttributes['id']
    | TribeAttributes['id']
    | PickOptionTypeEnum
    | string;
  pointsEarned: PickPointsAttributes['points'] | null;
  rank: number;
  status: PickSubmissionStatus;
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
    public rank!: number;
    public status!: PickSubmissionStatus;

    static associate(models: any) {
      if (models.SurveySubmissions) {
        this.belongsTo(models.SurveySubmissions, {
          foreignKey: 'surveySubmissionId',
          targetKey: 'surveySubmissionId',
          as: 'surveySubmission',
        });
      } else {
        logger.error('Error associating PickSubmission with SurveySubmissions');
      }
      if (models.Picks) {
        this.belongsTo(models.Picks, {
          foreignKey: 'pickId',
          targetKey: 'pickId',
          as: 'pick',
        });
      } else {
        logger.error('Error associating PickSubmission with Picks');
      }
    }
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
      rank: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'RANK',
      },
      status: {
        type: DataTypes.ENUM(
          PickSubmissionStatus.PENDING,
          PickSubmissionStatus.CORRECT,
          PickSubmissionStatus.INCORRECT
        ),
        allowNull: false,
        defaultValue: PickSubmissionStatus.PENDING,
        field: 'STATUS',
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
