import { DataTypes, Model, Sequelize } from 'sequelize';
import { PickOptionTypeEnum } from '../../../generated-api';

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
      this.belongsToMany(models.PickOptions, {
        through: 'PCK_PICK_OPTIONS_PICKS',
      });
      // this.hasMany(models.ProfilePick, { foreignKey: 'pickId', as: 'profilePicks' });
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
