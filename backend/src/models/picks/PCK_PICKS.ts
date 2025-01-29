import { DataTypes, Model, Sequelize } from 'sequelize';
import { sequelize } from '../../config/db';
import { PickTypeEnum } from './PCK_PICK_TYPE';

export enum SurveyType {
  Weekly = 'Weekly',
  Premier = 'Premier',
}

export interface PicksAttributes {
  pickId: string;
  surveyType: SurveyType;
  description: string;
  isCustom: boolean;
  type: PickTypeEnum;
}

const PicksModel = (sequelize: Sequelize) => {
  class Picks extends Model<PicksAttributes> implements PicksAttributes {
    public pickId!: string;
    public surveyType!: SurveyType;
    public description!: string;
    public isCustom!: boolean;
    public type!: PickTypeEnum;

    static associate(models: any) {
      // this.hasOne(models.PickOptions, { foreignKey: 'pickId', as: 'pickOptions' });
      this.belongsToMany(models.PickOptions, { through: 'PCK_PICK_OPTIONS_PICKS' });
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
      surveyType: {
        type: DataTypes.ENUM,
        values: Object.values(SurveyType),
        allowNull: false,
        field: 'SURVEY_TYPE',
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
        type: DataTypes.ENUM(...Object.values(PickTypeEnum)),
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
