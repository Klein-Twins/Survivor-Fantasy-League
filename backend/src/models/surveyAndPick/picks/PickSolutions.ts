import { UUID } from 'crypto';
import { DataTypes, Model, Sequelize } from 'sequelize';
import { EpisodeAttributes } from '../../season/Episodes';
import { SurvivorsAttributes } from '../../survivors/Survivors';
import { TribeAttributes } from '../../season/Tribes';
import { EpisodeSurveyAttributes } from '../EpisodeSurvey';
import logger from '../../../config/logger';

export interface PickSolutionAttributes {
  pickId: UUID;
  episodeSurveyId: EpisodeSurveyAttributes['episodeSurveyId'];
  episodeId: EpisodeAttributes['id']; //Episode ID then pick was fulfilled on
  solution: SurvivorsAttributes['id'] | TribeAttributes['id'];
  rank: number;
}

const PickSolutionModel = (sequelize: Sequelize) => {
  class PickSolutions
    extends Model<PickSolutionAttributes>
    implements PickSolutionAttributes
  {
    public pickId!: PickSolutionAttributes['pickId'];
    public episodeSurveyId!: PickSolutionAttributes['episodeSurveyId'];
    public episodeId!: PickSolutionAttributes['episodeId'];
    public solution!: PickSolutionAttributes['solution'];
    public rank!: PickSolutionAttributes['rank'];

    static associate(models: any) {
      if (models.Picks) {
        this.belongsTo(models.Picks, {
          foreignKey: 'pickId',
          targetKey: 'pickId',
          as: 'pick',
          onDelete: 'CASCADE',
        });
      } else {
        logger.error('Error associating PickSolutions with Picks');
      }

      if (models.EpisodeSurvey) {
        this.belongsTo(models.EpisodeSurvey, {
          foreignKey: 'episodeSurveyId',
          targetKey: 'episodeSurveyId',
          as: 'episodeSurvey',
          onDelete: 'CASCADE',
        });
      } else {
        logger.error('Error associating PickSolutions with EpisodeSurvey');
      }

      if (models.Episode) {
        this.belongsTo(models.Episode, {
          foreignKey: 'episodeId',
          targetKey: 'id',
          as: 'fulfilledOnEpisode',
          onDelete: 'CASCADE',
        });
      } else {
        logger.error('Error associating PickSolutions with Episode');
      }
    }
  }

  PickSolutions.init(
    {
      pickId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      episodeSurveyId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      episodeId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      solution: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      rank: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'PCK_SOLUTIONS',
      timestamps: true,
    }
  );
  return PickSolutions;
};

export default PickSolutionModel;
