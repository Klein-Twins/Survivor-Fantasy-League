import { UUID } from 'crypto';
import { DataTypes, Model, Sequelize } from 'sequelize';

export interface PickPointsAttributes {
  pickId: UUID;
  points: number;
}

const PickPointsModel = (sequelize: Sequelize) => {
  class PickPoints extends Model<PickPointsAttributes> implements PickPointsAttributes {
    public pickId!: UUID;
    public points!: number;

    static associate(models: any) {
      // this.belongsTo(models.Picks, { foreignKey: 'pickId', as: 'pick' });
    }
  }

  PickPoints.init(
    {
      pickId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        field: 'PICK_ID',
      },
      points: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'POINTS',
      },
    },
    {
      sequelize,
      tableName: 'PCK_PICK_POINTS',
      timestamps: true,
    }
  );

  return PickPoints;
};

export default PickPointsModel;
