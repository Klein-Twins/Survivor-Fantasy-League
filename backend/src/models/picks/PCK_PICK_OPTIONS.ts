import { UUID } from 'crypto';
import { DataTypes, Model, Sequelize } from 'sequelize';
import { PickTypeEnum as PickType } from './PCK_PICK_TYPE';

export interface PickOptionsAttributes {
  type: PickType;
  choice: string;
}

const PickOptionsModel = (sequelize: Sequelize) => {
  class PickOptions extends Model<PickOptionsAttributes> implements PickOptionsAttributes {
    public type!: PickType;
    public choice!: string;

    static associate(models: any) {
      // this.belongsTo(models.Picks, { foreignKey: 'pickId', as: 'pick' });
    }
  }

  PickOptions.init(
    {
      type: {
        type: DataTypes.ENUM,
        values: Object.values(PickType),
        field: 'PICK_OPTION_TYPE',
        allowNull: false,
        primaryKey: true,
      },
      choice: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'CHOICE',
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
