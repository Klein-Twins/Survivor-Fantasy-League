import { UUID } from 'crypto';
import { DataTypes, Model, Sequelize } from 'sequelize';

export interface PickSolutionAttributes {
  pickId: UUID;
  episodeId: UUID;
  correctAnswerSurvivorId: UUID | null;
  correctAnswerTribeId: UUID | null;
  correctAnswerBinary: boolean | null;
  correctAnswerCustom: string | null;
}

const PickSolutionModel = (sequelize: Sequelize) => {
  class PickSolution extends Model<PickSolutionAttributes> implements PickSolutionAttributes {
    public pickId!: UUID;
    public episodeId!: UUID;
    public correctAnswerSurvivorId!: UUID | null;
    public correctAnswerTribeId!: UUID | null;
    public correctAnswerBinary!: boolean | null;
    public correctAnswerCustom!: string | null;

    static associate(models: any) {
      // this.belongsTo(models.Picks, { foreignKey: 'pickId', as: 'pick' });
      // this.belongsTo(models.Episodes, { foreignKey: 'episodeId', as: 'episode' });
      // this.belongsTo(models.PickOptions, { foreignKey: 'correctAnswerSurvivorId', as: 'correctAnswerSurvivor' });
      // this.belongsTo(models.PickOptions, { foreignKey: 'correctAnswerTribeId', as: 'correctAnswerTribe' });
    }
  }

  PickSolution.init(
    {
      pickId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        field: 'PICK_ID',
      },
      episodeId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        field: 'EPISODE_ID',
      },
      correctAnswerSurvivorId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'CORRECT_ANSWER_SURVIVOR_ID',
      },
      correctAnswerTribeId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'CORRECT_ANSWER_TRIBE_ID',
      },
      correctAnswerBinary: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: 'CORRECT_ANSWER_BINARY',
      },
      correctAnswerCustom: {
        type: DataTypes.STRING(200),
        allowNull: true,
        field: 'CORRECT_ANSWER_CUSTOM',
      },
    },
    {
      sequelize,
      tableName: 'PCK_CORRECT_ANSWERS',
      timestamps: true,
    }
  );
  return PickSolution;
};

export default PickSolutionModel;
