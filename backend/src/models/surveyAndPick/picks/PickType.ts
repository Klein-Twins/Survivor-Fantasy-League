import { UUID } from 'crypto';
import { DataTypes, Model, Sequelize } from 'sequelize';
import { PickOptionTypeEnum } from '../../../generated-api';
import logger from '../../../config/logger';

interface PickTypeAttributes {
  pickId: UUID;
  type: PickOptionTypeEnum;
}

const PickTypeModel = (sequelize: Sequelize) => {
  class PickType
    extends Model<PickTypeAttributes>
    implements PickTypeAttributes
  {
    public pickId!: UUID;
    public type!: PickOptionTypeEnum;

    static associate(models: any) {
      if (models.Picks) {
        this.belongsTo(models.Picks, {
          foreignKey: 'pickId',
          targetKey: 'pickId',
          as: 'pick',
          onDelete: 'CASCADE',
        });
      } else {
        logger.error('Error associating PickType with Picks');
      }
    }
  }

  PickType.init(
    {
      pickId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        field: 'PICK_ID',
      },
      type: {
        type: DataTypes.ENUM,
        values: Object.values(PickOptionTypeEnum),
        allowNull: false,
        field: 'TYPE',
      },
    },
    {
      sequelize,
      tableName: 'PCK_PICK_TYPE',
      timestamps: true,
    }
  );

  return PickType;
};

export default PickTypeModel;
