import { UUID } from 'crypto';
import { DataTypes, Model, Sequelize } from 'sequelize';
import { TribalCouncilAttributes } from './TribalCouncil';
import { SurvivorsAttributes } from '../../survivors/Survivors';
import logger from '../../../config/logger';

export type TribalCouncilSurvivorsAttributes =
  TribalCouncilSurvivorsDependencyAttributes &
    TribalCouncilSurvivorsTableAttributes;

type TribalCouncilSurvivorsTableAttributes = {};

type TribalCouncilSurvivorsDependencyAttributes = {
  tribalCouncilId: TribalCouncilAttributes['id'];
  survivorId: SurvivorsAttributes['id'];
};

const TribalCouncilSurvivorsModel = (sequelize: Sequelize) => {
  class TribalCouncilSurvivors
    extends Model<TribalCouncilSurvivorsAttributes>
    implements TribalCouncilSurvivorsAttributes
  {
    public tribalCouncilId!: TribalCouncilSurvivorsAttributes['tribalCouncilId'];
    public survivorId!: TribalCouncilSurvivorsAttributes['survivorId'];

    static associate(models: any) {
      if (models.TribalCouncils) {
        this.belongsTo(models.TribalCouncils, {
          foreignKey: 'tribalCouncilId',
          targetKey: 'id',
          as: 'tribalCouncil',
          onDelete: 'CASCADE',
        });
      } else {
        logger.error(
          'Error associating TribalCouncilSurvivors with TribalCouncil'
        );
      }
      if (models.SurvivorDetailsOnSeason) {
        this.belongsTo(models.SurvivorDetailsOnSeason, {
          foreignKey: 'survivorId',
          targetKey: 'id',
          as: 'survivor',
          onDelete: 'CASCADE',
        });
      } else {
        logger.error(
          'Error associating TribalCouncilSurvivors with SurvivorDetailsOnSeason'
        );
      }
    }
  }
  TribalCouncilSurvivors.init(
    {
      tribalCouncilId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'TRIBAL_COUNCIL_ID',
      },
      survivorId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'SURVIVOR_ID',
      },
    },
    {
      sequelize,
      tableName: 'TribalCouncilSurvivors',
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ['TRIBAL_COUNCIL_ID', 'SURVIVOR_ID'],
        },
      ],
    }
  );
  return TribalCouncilSurvivors;
};

export default TribalCouncilSurvivorsModel;
