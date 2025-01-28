import { UUID } from 'crypto';
import { DataTypes, Model, Sequelize } from 'sequelize';

export interface TribeAttributes {
  id: UUID;
  name: string;
  seasonId: UUID;
  mergeTribe: boolean;
}

const TribeModel = (sequelize: Sequelize) => {
  class Tribe extends Model<TribeAttributes> implements TribeAttributes {
    public id!: UUID;
    public name!: string;
    public seasonId!: UUID;
    public mergeTribe!: boolean;

    static associate(models: any) {
      //    this.belongsTo(models.Season, { foreignKey: 'seasonId', as: 'season' });
      this.hasMany(models.ProfilePick, {
        foreignKey: 'pickAnswerTribeId',
        sourceKey: 'id',
        as: 'profilePicks',
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
