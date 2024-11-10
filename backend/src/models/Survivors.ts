import { DataTypes, Model, Sequelize } from 'sequelize';

export interface SurvivorsAttributes {
  survivorId: string;
  firstName: string;
  lastName: string;
  fromState: string;
  fromCity?: string | null;
  fromCountry: string;
  nickName?: string | null;
}

const SurvivorsModel = (sequelize: Sequelize) => {
  class Survivors extends Model<SurvivorsAttributes> implements SurvivorsAttributes {
    public survivorId!: string;
    public firstName!: string;
    public lastName!: string;
    public fromState!: string;
    public fromCountry!: string;
    public nickName?: string | null;
    public fromCity?: string | null;

    static associate(models: any) {
      this.hasMany(models.SurvivorDetailsOnSeason, { foreignKey: 'survivorId', as: 'SurvivorDetailsOnSeason' });
    }
  }

  Survivors.init(
    {
      survivorId: {
        type: DataTypes.UUID,
        primaryKey: true,
        field: 'SURVIVOR_ID',
      },
      firstName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'FIRST_NAME',
      },
      lastName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'LAST_NAME',
      },
      fromCity: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'FROM_CITY',
      },
      fromState: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'FROM_STATE',
      },
      fromCountry: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'FROM_COUNTRY',
      },
      nickName: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'NICK_NAME'
      }
    },
    {
      sequelize,
      tableName: 'CST_SURVIVORS',
      timestamps: false,
    }
  );

  return Survivors;
};

export default SurvivorsModel;