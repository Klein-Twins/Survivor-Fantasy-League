import { UUID } from 'crypto';
import { LeagueProfileAttributes } from './LeagueProfile';
import { PicksAttributes } from '../surveysAndPicks/picks/Picks';
import { PickPointsAttributes } from '../surveysAndPicks/picks/PickPoints';
import { LeagueSurveyAttributes } from './LeagueSurveys';
import { SurvivorsAttributes } from '../survivors/Survivors';
import { TribeAttributes } from '../season/Tribes';
import { PickOptionTypeEnum } from '../../generated-api';
import { DataTypes, Model, Sequelize } from 'sequelize';

export interface SurveySubmissionAttributes {
  surveySubmissionId: UUID;
  pickId: PicksAttributes['pickId'];
  leagueProfileId: LeagueProfileAttributes['id'];
  playerChoice:
    | SurvivorsAttributes['survivorId']
    | TribeAttributes['id']
    | PickOptionTypeEnum
    | string;
  pointsEarned: PickPointsAttributes['points'] | null;
  leagueSurveyId: LeagueSurveyAttributes['leagueSurveyId'];
}

const SurveySubmissionModel = (sequelize: Sequelize) => {
  class SurveySubmission
    extends Model<SurveySubmissionAttributes>
    implements SurveySubmissionAttributes
  {
    public surveySubmissionId!: SurveySubmissionAttributes['surveySubmissionId'];
    public pickId!: SurveySubmissionAttributes['pickId'];
    public leagueProfileId!: SurveySubmissionAttributes['leagueProfileId'];
    public playerChoice!: SurveySubmissionAttributes['playerChoice'];
    public pointsEarned!: SurveySubmissionAttributes['pointsEarned'];
    public leagueSurveyId!: SurveySubmissionAttributes['leagueSurveyId'];

    static associate(models: any) {}
  }
  SurveySubmission.init(
    {
      surveySubmissionId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        field: 'SURVEY_SUBMISSION_ID',
      },
      pickId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'PICK_ID',
      },
      leagueProfileId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'LEAGUE_PROFILE_ID',
      },
      playerChoice: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'PLAYER_CHOICE',
        validate: {
          isValidChoice(value: string) {
            const uuidV4Regex =
              /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            if (!uuidV4Regex.test(value) && typeof value !== 'string') {
              throw new Error('PLAYER_CHOICE must be a valid UUID or string');
            }
          },
        },
      },
      pointsEarned: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'POINTS_EARNED',
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
          fields: ['PICK_ID', 'LEAGUE_PROFILE_ID', 'LEAGUE_SURVEY_ID'],
        },
      ],
    }
  );
  return SurveySubmission;
};

export default SurveySubmissionModel;
