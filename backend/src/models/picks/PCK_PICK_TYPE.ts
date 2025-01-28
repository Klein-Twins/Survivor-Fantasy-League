import { UUID } from 'crypto';
import { DataTypes, Model, Sequelize } from 'sequelize';

export enum PickTypeEnum {
  color = 'color',
  survivor = 'survivor',
  tribe = 'tribe',
  binary = 'binary',
}

interface PickTypeAttributes {
  pickId: UUID;
  type: PickTypeEnum;
}

const PickTypeModel = (sequelize: Sequelize) => {
  class PickType extends Model<PickTypeAttributes> implements PickTypeAttributes {
    public pickId!: UUID;
    public type!: PickTypeEnum;

    static associate(models: any) {
      // this.hasMany(models.PickOptions, { foreignKey: 'pickId', as: 'pickOptions' });
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
        values: Object.values(PickTypeEnum),
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
