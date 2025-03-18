import { UUID } from 'crypto';
import { DataTypes, Model, Sequelize } from 'sequelize';

export interface SurvivorsAttributes {
  id: UUID;
  firstName: string;
  lastName: string;
  fromState: string;
  fromCity?: string | null;
  fromCountry: string;
  nickName?: string | null;
}

const SurvivorsModel = (sequelize: Sequelize) => {
  class Survivors
    extends Model<SurvivorsAttributes>
    implements SurvivorsAttributes
  {
    public id!: SurvivorsAttributes['id'];
    public firstName!: SurvivorsAttributes['firstName'];
    public lastName!: SurvivorsAttributes['lastName'];
    public fromState!: SurvivorsAttributes['fromState'];
    public fromCountry!: SurvivorsAttributes['fromCountry'];
    public nickName?: SurvivorsAttributes['nickName'];
    public fromCity?: SurvivorsAttributes['fromCity'];

    static associate(models: any) {
      this.hasMany(models.SurvivorDetailsOnSeason, {
        foreignKey: 'id',
        sourceKey: 'id',
        as: 'SurvivorDetailsOnSeason',
      });
      this.hasMany(models.ChallengeWinners, {
        foreignKey: 'winnerSurvivorId',
        sourceKey: 'id',
        as: 'challengeWins',
      });
    }
  }

  Survivors.init(
    {
      id: {
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
        field: 'NICK_NAME',
      },
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
