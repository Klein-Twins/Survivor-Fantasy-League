import { DataTypes, Model, Sequelize } from 'sequelize';
import logger from '../../../config/logger';
import { UUID } from 'crypto';

export interface PicksAttributes {
  pickId: UUID;
  description: string;
  notes: string | null;
  eventType: EventType;
}

export enum EventType {
  SurvivorElimination = 'SURVIVOR_ELIMINATION',
  ImmunityChallengeWinner = 'IMMUNITY_CHALLENGE_WINNER',
}

const PicksModel = (sequelize: Sequelize) => {
  class Picks extends Model<PicksAttributes> implements PicksAttributes {
    public pickId!: PicksAttributes['pickId'];
    public description!: PicksAttributes['description'];
    public notes!: PicksAttributes['notes'];
    public eventType!: PicksAttributes['eventType'];

    static associate(models: any) {
      // this.hasOne(models.PickOptions, { foreignKey: 'pickId', as: 'pickOptions' });

      if (models.SurveyPicks) {
        this.hasMany(models.SurveyPicks, {
          foreignKey: 'pickId',
          sourceKey: 'pickId',
          as: 'surveyPicks',
          onDelete: 'CASCADE',
        });
      } else {
        logger.error('Error associating Picks with SurveyPicks');
      }
      if (models.PickSubmissions) {
        this.hasMany(models.PickSubmissions, {
          foreignKey: 'pickId',
          sourceKey: 'pickId',
          as: 'pickSubmissions',
          onDelete: 'CASCADE',
        });
      } else {
        logger.error('Error associating Picks with PickSubmissions');
      }
      if (models.PickPoints) {
        this.hasOne(models.PickPoints, {
          foreignKey: 'pickId',
          sourceKey: 'pickId',
          as: 'points',
          onDelete: 'CASCADE',
        });
      } else {
        logger.error('Error associating Picks with PickPoints');
      }
      if (models.PickOptions) {
        this.hasOne(models.PickOptions, {
          foreignKey: 'pickId',
          sourceKey: 'pickId',
          as: 'pickOptions',
          onDelete: 'CASCADE',
        });
      } else {
        logger.error('Error associating Picks with PickOptions');
      }
      if (models.PickSolutions) {
        this.hasMany(models.PickSolutions, {
          foreignKey: 'pickId',
          sourceKey: 'pickId',
          as: 'pickSolutions',
          onDelete: 'CASCADE',
        });
      } else {
        logger.error('Error associating Picks with PickSolutions');
      }
    }
  }

  Picks.init(
    {
      pickId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        field: 'PICK_ID',
      },
      description: {
        type: DataTypes.STRING(300),
        allowNull: false,
        field: 'DESCRIPTION',
      },
      notes: {
        type: DataTypes.STRING(300),
        allowNull: true,
        field: 'NOTES',
      },
      eventType: {
        type: DataTypes.ENUM(...Object.values(EventType)),
        allowNull: false,
        field: 'EVENT_TYPE',
      },
    },
    {
      sequelize,
      tableName: 'PCK_PICKS',
      timestamps: true,
    }
  );

  return Picks;
};

export default PicksModel;
