import { UUID } from 'crypto';
import { DataTypes, Model, Sequelize } from 'sequelize';
import { EpisodeAttributes } from '../Episodes';

/**
 * Notes about the Challenge model:
 *
 * Rewards:
 *  - Reward challenges are challenges that are played for a reward. The reward can be anything from food to a clue to an advantage in the game.
 * - Reward challenges are typically played in teams, but can also be played individually.
 * - There can be winners of type tribe and winners of type individual.
 *  - There can be multiple winners of a reward challenge.
 *
 */

export enum ChallengeType {
  REWARD = 'Reward',
  IMMUNITY = 'Immunity',
  REWARD_AND_IMMUNITY = 'Reward and Immunity',
}
export interface ChallengeAttributes {
  challengeId: UUID;
  episodeId: EpisodeAttributes['episodeId'];
  description: string | null;
  notes: string | null;
  type: ChallengeType;
}

const ChallengeModel = (sequelize: Sequelize) => {
  class Challenge
    extends Model<ChallengeAttributes>
    implements ChallengeAttributes
  {
    public challengeId!: ChallengeAttributes['challengeId'];
    public episodeId!: ChallengeAttributes['episodeId'];
    public description!: ChallengeAttributes['description'];
    public notes!: ChallengeAttributes['notes'];
    public type!: ChallengeAttributes['type'];

    static associate(models: any) {
      this.belongsTo(models.Episode, {
        foreignKey: 'episodeId',
        targetKey: 'episodeId',
        as: 'episode',
      });
    }
  }

  Challenge.init(
    {
      challengeId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        field: 'CHALLENGE_ID',
      },
      description: {
        type: DataTypes.STRING(150),
        allowNull: true,
        field: 'DESCRIPTION',
      },
      notes: {
        type: DataTypes.STRING(1000),
        allowNull: true,
        field: 'NOTES',
      },
      type: {
        type: DataTypes.ENUM(...Object.values(ChallengeType)),
        allowNull: false,
        field: 'TYPE',
      },
      episodeId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'EPISODE_ID',
      },
    },
    {
      sequelize,
      modelName: 'Challenges',
      tableName: 'SSN_CHALLENGES',
      timestamps: false,
    }
  );

  return Challenge;
};

export default ChallengeModel;
