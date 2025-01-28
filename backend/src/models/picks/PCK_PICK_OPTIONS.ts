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
      //   this.hasMany(models.ProfilePick, {
      //     foreignKey: {
      //       name: 'pickAnswerSurvivorId',
      //       allowNull: true,
      //     },
      //     scope: {
      //       type: 'survivor',
      //     },
      //     as: 'survivorPicks',
      //     constraints: true,
      //   });
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
