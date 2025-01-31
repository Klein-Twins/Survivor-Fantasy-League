import { UUID } from 'crypto';
import { DataTypes, Model, Sequelize } from 'sequelize';
import { PickTypeEnum as PickType } from './PCK_PICK_TYPE';
import { ColorsEnum } from '../../generated-api';

export interface PickOptionsAttributes {
  type: PickType;
  choice: string;
}

const PickOptionsModel = (sequelize: Sequelize) => {
  class PickOptions extends Model<PickOptionsAttributes> implements PickOptionsAttributes {
    public type!: PickType;
    public choice!: string;

    static associate(models: any) {
      //   this.hasMany(models.ProfilePicks, {
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

      this.belongsToMany(models.Picks, { through: 'PCK_PICK_OPTIONS_PICKS' });
    }
  }

  PickOptions.init(
    {
      type: {
        type: DataTypes.ENUM,
        values: Object.values(PickType),
        field: 'PICK_OPTION_TYPE',
        allowNull: false,
      },
      choice: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'CHOICE',
        validate: {
          isValidChoice(value: string) {
            if (this.type === 'color' && !Object.values(ColorsEnum).includes(value as ColorsEnum)) {
              throw new Error('Choice must be a valid color when type is color');
            }
          },
        },
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
