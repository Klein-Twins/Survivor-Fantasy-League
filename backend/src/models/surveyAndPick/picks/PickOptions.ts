import { DataTypes, Model, Sequelize } from 'sequelize';
import { PickOptionTypeEnum } from '../../../generated-api';
import { PicksAttributes } from './Picks';
import logger from '../../../config/logger';

export interface PickOptionsAttributes {
  type: PickOptionTypeEnum;
  minNumSelections: number;
  maxNumSelections: number;
  noneOptionAllowed: boolean;
  pickId: PicksAttributes['pickId'];
}

const PickOptionsModel = (sequelize: Sequelize) => {
  class PickOptions
    extends Model<PickOptionsAttributes>
    implements PickOptionsAttributes
  {
    public type!: PickOptionsAttributes['type'];
    public minNumSelections!: PickOptionsAttributes['minNumSelections'];
    public maxNumSelections!: PickOptionsAttributes['maxNumSelections'];
    public noneOptionAllowed!: PickOptionsAttributes['noneOptionAllowed'];
    public pickId!: PickOptionsAttributes['pickId'];

    static associate(models: any) {
      if (models.Picks) {
        this.belongsTo(models.Picks, {
          foreignKey: 'pickId',
          targetKey: 'pickId',
          as: 'pick',
        });
      } else {
        logger.error('Error associating PickOptions with Picks');
      }
    }
  }

  PickOptions.init(
    {
      type: {
        type: DataTypes.ENUM,
        values: Object.values(PickOptionTypeEnum),
        allowNull: false,
        validate: {
          notEmpty: true,
          isIn: {
            args: [Object.values(PickOptionTypeEnum)],
            msg: `type must be one of the following values: ${Object.values(
              PickOptionTypeEnum
            ).join(', ')}`,
          },
        },
      },
      minNumSelections: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
          min: {
            args: [1],
            msg: 'minNumSelections must be greater than or equal to 1',
          },
        },
      },
      maxNumSelections: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
          isGreaterThanMin(value: number) {
            const instance = this as unknown as PickOptions;
            if (value < instance.minNumSelections) {
              throw new Error(
                'maxNumSelections must be greater than or equal to minNumSelections'
              );
            }
          },
        },
      },
      noneOptionAllowed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      pickId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      sequelize,
      tableName: 'PCK_PICK_OPTIONS',
      timestamps: true,
    }
  );

  return PickOptions;
};

export default PickOptionsModel;
