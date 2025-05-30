import { UUID } from 'crypto';
import { DataTypes, Model, Op, Sequelize } from 'sequelize';

import { SurvivorsAttributes } from '../../survivors/Survivors';
import { TribeAttributes } from '../Tribes';
import { ChallengeAttributes } from './Challenges';
import logger from '../../../config/logger';

export enum ChallengeWinnerType {
  Survivor = 'Survivor',
  Tribe = 'Tribe',
  Survivors = 'Survivors',
}

export interface ChallengeWinnersAttributes {
  challengeId: ChallengeAttributes['id'];
  winnerSurvivorId: SurvivorsAttributes['id'] | null;
  winnerTribeId: TribeAttributes['id'] | null;
  rank: number;
  reward: string | null;
  winnerType: ChallengeWinnerType;
  winnerNotes: string | null;
}

const ChallengeWinnersModel = (sequelize: Sequelize) => {
  class ChallengeWinners
    extends Model<ChallengeWinnersAttributes>
    implements ChallengeWinnersAttributes
  {
    public challengeId!: ChallengeWinnersAttributes['challengeId'];
    public winnerSurvivorId!: ChallengeWinnersAttributes['winnerSurvivorId'];
    public winnerTribeId!: ChallengeWinnersAttributes['winnerTribeId'];
    public rank!: ChallengeWinnersAttributes['rank'];
    public reward!: ChallengeWinnersAttributes['reward'];
    public winnerType!: ChallengeWinnersAttributes['winnerType'];
    public winnerNotes!: ChallengeWinnersAttributes['winnerNotes'];

    static associate(models: any) {
      if (models.SurvivorDetailsOnSeason) {
        this.belongsTo(models.SurvivorDetailsOnSeason, {
          foreignKey: 'winnerSurvivorId',
          targetKey: 'id',
          as: 'survivorWinner',
          onDelete: 'CASCADE',
        });
      } else {
        logger.error(
          'Error associating ChallengeWinners with SurvivorDetailsOnSeason'
        );
      }
      if (models.Tribe) {
        this.belongsTo(models.Tribe, {
          foreignKey: 'winnerTribeId',
          targetKey: 'id',
          as: 'tribeWinner',
          onDelete: 'CASCADE',
        });
      } else {
        logger.error('Error associating ChallengeWinners with Tribe');
      }
      if (models.Challenges) {
        this.belongsTo(models.Challenges, {
          foreignKey: 'challengeId',
          targetKey: 'id',
          as: 'challenge',
          onDelete: 'CASCADE',
        });
      } else {
        logger.error('Error associating ChallengeWinners with Challenge');
      }
    }
  }

  ChallengeWinners.init(
    {
      challengeId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'CHALLENGE_ID',
      },
      winnerSurvivorId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'WINNER_SURVIVOR_ID',
        validate: {
          xorCheck(value: string | null) {
            if (
              (value === null && this.winnerTribeId === null) ||
              (value !== null && this.winnerTribeId !== null)
            ) {
              throw new Error(
                'Exactly one of winnerSurvivorId or winnerTribeId must be non-null'
              );
            }
          },
        },
      },
      winnerTribeId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'WINNER_TRIBE_ID',
        validate: {
          xorCheck(value: string | null) {
            if (
              (value === null && this.winnerSurvivorId === null) ||
              (value !== null && this.winnerSurvivorId !== null)
            ) {
              throw new Error(
                'Exactly one of winnerSurvivorId or winnerTribeId must be non-null'
              );
            }
          },
        },
      },
      rank: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'RANK',
      },
      reward: {
        type: DataTypes.STRING(150),
        allowNull: true,
        field: 'REWARD',
      },
      winnerType: {
        type: DataTypes.ENUM(...Object.values(ChallengeWinnerType)),
        allowNull: false,
        field: 'WINNER_TYPE',
      },
      winnerNotes: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: 'WINNER_NOTES',
      },
    },
    {
      sequelize,
      modelName: 'ChallengeWinners',
      tableName: 'SSN_CHALLENGE_WINNERS',
      indexes: [
        {
          name: 'challenge_winner_tribe_unique',
          unique: true,
          fields: ['RANK', 'CHALLENGE_ID', 'WINNER_SURVIVOR_ID'],
          where: {
            WINNER_SURVIVOR_ID: {
              [Op.ne]: null,
            },
          },
        },
        {
          name: 'challenge_winner_survivor_unique',
          unique: true,
          fields: ['RANK', 'CHALLENGE_ID', 'WINNER_TRIBE_ID'],
          where: {
            WINNER_TRIBE_ID: {
              [Op.ne]: null,
            },
          },
        },
      ],
    }
  );

  return ChallengeWinners;
};

export default ChallengeWinnersModel;
