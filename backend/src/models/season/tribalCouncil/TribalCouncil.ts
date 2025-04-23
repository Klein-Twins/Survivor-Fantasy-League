import { UUID } from 'crypto';
import { DataTypes, Model, Sequelize } from 'sequelize';
import logger from '../../../config/logger';
import { EpisodeAttributes } from '../Episodes';
import { TribeAttributes } from '../Tribes';

export type TribalCouncilAttributes = TribalCouncilTableAttributes &
  TribalCouncilDependencyAttributes;

export type TribalCouncilTableAttributes = {
  id: UUID;
  day: number;
  seq: number; //Seq of the tribal council on that episode (for episodes with multiple tribal councils)
};

export type TribalCouncilDependencyAttributes = {
  episodeId: EpisodeAttributes['id'];
  attendingTribeId: TribeAttributes['id'] | null;
};

const TribalCouncilModel = (sequelize: Sequelize) => {
  class TribalCouncil
    extends Model<TribalCouncilAttributes>
    implements TribalCouncilAttributes
  {
    public id!: TribalCouncilAttributes['id'];
    public day!: TribalCouncilAttributes['day'];
    public seq!: TribalCouncilAttributes['seq'];
    public episodeId!: TribalCouncilDependencyAttributes['episodeId'];
    public attendingTribeId!: TribalCouncilDependencyAttributes['attendingTribeId'];

    static associate(models: any) {
      if (models.Episode) {
        this.belongsTo(models.Episode, {
          foreignKey: 'episodeId',
          targetKey: 'id',
          as: 'episode',
          onDelete: 'CASCADE',
        });
      } else {
        logger.error('Error associating TribalCouncil with Episode');
      }
      if (models.Tribe) {
        this.belongsTo(models.Tribe, {
          foreignKey: 'attendingTribeId',
          targetKey: 'id',
          as: 'attendingTribe',
          onDelete: 'CASCADE',
        });
      } else {
        logger.error('Error associating TribalCouncil with Tribe');
      }
      if (models.TribalCouncilSurvivors) {
        this.hasMany(models.TribalCouncilSurvivors, {
          foreignKey: 'tribalCouncilId',
          sourceKey: 'id',
          as: 'survivors',
          onDelete: 'CASCADE',
        });
      } else {
        logger.error(
          'Error associating TribalCouncil with TribalCouncilSurvivors'
        );
      }
      if (models.SeasonEliminations) {
        this.hasOne(models.SeasonEliminations, {
          foreignKey: 'tribalCouncilId',
          sourceKey: 'id',
          as: 'elimination',
          onDelete: 'CASCADE',
        });
      }
    }
  }
  TribalCouncil.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'TRIBAL_COUNCIL_ID',
      },
      day: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'DAY',
      },
      episodeId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'EPISODE_ID',
      },
      seq: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'SEQ',
      },
      attendingTribeId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'ATTENDING_TRIBE_ID', //If null, then refer to the TribalCouncilSurvivors table
      },
    },
    {
      sequelize,
      tableName: 'SSN_TRIBAL_COUNCIL',
      indexes: [
        {
          unique: true,
          fields: ['EPISODE_ID', 'SEQ'],
        },
      ],
    }
  );
  return TribalCouncil;
};

export default TribalCouncilModel;
