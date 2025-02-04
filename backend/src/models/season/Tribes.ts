import { UUID } from 'crypto';
import { DataTypes, Model, Sequelize } from 'sequelize';
import { SeasonsAttributes } from './Seasons';

export interface TribeAttributes {
  id: UUID;
  name: string;
  seasonId: SeasonsAttributes['seasonId'];
  tribeColor: string;
  mergeTribe: boolean;
}

const TribeModel = (sequelize: Sequelize) => {
  class Tribe extends Model<TribeAttributes> implements TribeAttributes {
    public id!: TribeAttributes['id'];
    public name!: TribeAttributes['name'];
    public seasonId!: TribeAttributes['seasonId'];
    public tribeColor!: TribeAttributes['tribeColor'];
    public mergeTribe!: TribeAttributes['mergeTribe'];

    static associate(models: any) {
      this.belongsTo(models.Seasons, {
        foreignKey: 'seasonId',
        targetKey: 'seasonId',
        as: 'season',
      });
      // this.hasMany(models.ProfilePick, {
      //   foreignKey: 'pickAnswerTribeId',
      //   sourceKey: 'id',
      //   as: 'profilePicks',
      // });

      this.hasMany(models.ChallengeWinners, {
        foreignKey: 'winnerTribeId',
        sourceKey: 'id',
        as: 'challengeWinners',
      });
    }
  }

  Tribe.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        field: 'TRIBE_ID',
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'TRIBE_NAME',
      },
      seasonId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'SEASON_ID',
      },
      mergeTribe: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: 'MERGE_TRIBE',
      },
      tribeColor: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: 'TRIBE_COLOR',
      },
    },
    {
      sequelize,
      tableName: 'SSN_TRIBES',
      timestamps: true,
    }
  );

  return Tribe;
};

export default TribeModel;
