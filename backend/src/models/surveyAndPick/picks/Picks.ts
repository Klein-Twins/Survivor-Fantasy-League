import { DataTypes, Model, Sequelize } from 'sequelize';
import logger from '../../../config/logger';
import { UUID } from 'crypto';

export interface PicksAttributes {
  pickId: UUID;
  description: string;
  notes?: string;
}

const PicksModel = (sequelize: Sequelize) => {
  class Picks extends Model<PicksAttributes> implements PicksAttributes {
    public pickId!: UUID;
    public description!: string;
    public notes?: string;

    static associate(models: any) {
      // this.hasOne(models.PickOptions, { foreignKey: 'pickId', as: 'pickOptions' });

      if (models.SurveyPicks) {
        this.hasMany(models.SurveyPicks, {
          foreignKey: 'pickId',
          sourceKey: 'pickId',
          as: 'surveyPicks',
        });
      } else {
        logger.error('Error associating Picks with SurveyPicks');
      }
      if (models.PickSubmissions) {
        this.hasMany(models.PickSubmissions, {
          foreignKey: 'pickId',
          sourceKey: 'pickId',
          as: 'pickSubmissions',
        });
      } else {
        logger.error('Error associating Picks with PickSubmissions');
      }
      if (models.PickPoints) {
        this.hasOne(models.PickPoints, {
          foreignKey: 'pickId',
          sourceKey: 'pickId',
          as: 'points',
        });
      } else {
        logger.error('Error associating Picks with PickPoints');
      }
      if (models.PickOptions) {
        this.hasOne(models.PickOptions, {
          foreignKey: 'pickId',
          sourceKey: 'pickId',
          as: 'pickOptions',
        });
      } else {
        logger.error('Error associating Picks with PickOptions');
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
