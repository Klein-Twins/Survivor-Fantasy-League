import { DataTypes, Model, Sequelize } from 'sequelize';
import { PickOptionTypeEnum } from '../../../generated-api';
import logger from '../../../config/logger';

export interface PicksAttributes {
  pickId: string;
  description: string;
  isCustom: boolean;
  type: PickOptionTypeEnum;
}

const PicksModel = (sequelize: Sequelize) => {
  class Picks extends Model<PicksAttributes> implements PicksAttributes {
    public pickId!: string;
    public description!: string;
    public isCustom!: boolean;
    public type!: PickOptionTypeEnum;

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
      isCustom: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: 'IS_CUSTOM',
        defaultValue: true,
      },
      type: {
        type: DataTypes.ENUM(...Object.values(PickOptionTypeEnum)),
        allowNull: false,
        field: 'TYPE',
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
