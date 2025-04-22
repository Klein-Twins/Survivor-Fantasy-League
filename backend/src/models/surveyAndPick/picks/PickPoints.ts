import { UUID } from 'crypto';
import { DataTypes, Model, Sequelize } from 'sequelize';
import logger from '../../../config/logger';

export interface PickPointsAttributes {
  pickId: UUID;
  points: number;
}

const PickPointsModel = (sequelize: Sequelize) => {
  class PickPoints
    extends Model<PickPointsAttributes>
    implements PickPointsAttributes
  {
    public pickId!: UUID;
    public points!: number;

    static associate(models: any) {
      if (models.Picks) {
        PickPoints.belongsTo(models.Picks, {
          foreignKey: 'pickId',
          targetKey: 'pickId',
          as: 'pick',
          onDelete: 'CASCADE',
        });
      } else {
        logger.error('Error associating PickPoints with Picks');
      }
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
