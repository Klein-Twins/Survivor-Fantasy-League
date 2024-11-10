import { DataTypes, Model, Sequelize } from 'sequelize';

export interface SurvivorsAttributes {
  SURVIVOR_ID: string;
  FIRST_NAME: string;
  LAST_NAME: string;
  FROM_STATE: string;
  FROM_CITY?: string | null;
  FROM_COUNTRY: string;
  NICK_NAME?: string | null;
}

const SurvivorsModel = (sequelize: Sequelize) => {
  class Survivors extends Model<SurvivorsAttributes> implements SurvivorsAttributes {
    public SURVIVOR_ID!: string;
    public FIRST_NAME!: string;
    public LAST_NAME!: string;
    public FROM_STATE!: string;
    public FROM_COUNTRY!: string;
    public NICK_NAME?: string | null;
    public FROM_CITY?: string | null;

    static associate(models: any) {
      this.hasMany(models.SurvivorDetailsOnSeason, { foreignKey: 'SURVIVOR_ID', as: 'SurvivorDetailsOnSeason' });
    }
  }

  Survivors.init(
    {
      SURVIVOR_ID: {
        type: DataTypes.UUID,
        primaryKey: true,
        field: 'SURVIVOR_ID',
      },
      FIRST_NAME: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'FIRST_NAME',
      },
      LAST_NAME: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'LAST_NAME',
      },
      FROM_CITY: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'FROM_CITY',
      },
      FROM_STATE: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'FROM_STATE',
      },
      FROM_COUNTRY: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'FROM_COUNTRY',
      },
      NICK_NAME: {
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