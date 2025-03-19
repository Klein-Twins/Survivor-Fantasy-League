import { DataTypes, Model, Sequelize } from 'sequelize';
import { PickOptionTypeEnum } from '../../../generated-api';
import { InternalServerError } from '../../../utils/errors/errors';

export interface PickOptionsAttributes {
  type: PickOptionTypeEnum;
  choice: string;
  choiceDescription: string;
}

const PickOptionsModel = (sequelize: Sequelize) => {
  class PickOptions
    extends Model<PickOptionsAttributes>
    implements PickOptionsAttributes
  {
    public type!: PickOptionTypeEnum;
    public choice!: string;
    public choiceDescription!: string;

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
        values: Object.values(PickOptionTypeEnum),
        field: 'PICK_OPTION_TYPE',
        allowNull: false,
      },
      choiceDescription: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'CHOICE_DESCRIPTION',

        validate: {
          isValidChoiceDescription(value: string) {
            if (this.type === 'color' && !value) {
              throw new InternalServerError(
                'Choice Description must be provided when type is color'
              );
            }
          },
        },
      },
      choice: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'CHOICE',
        validate: {
          isValidChoice(value: string) {
            if (this.type === 'color' && !value.match(/^#([A-Fa-f0-9]{6})$/)) {
              throw new Error(
                'Choice must be a hexadecimal value when type is color'
              );
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
