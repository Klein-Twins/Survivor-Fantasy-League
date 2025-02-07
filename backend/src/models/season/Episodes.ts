import { UUID } from 'crypto';
import { DataTypes, Model, Sequelize } from 'sequelize';
import { SeasonsAttributes } from './Seasons';

export interface EpisodeAttributes {
  episodeId: UUID | string;
  seasonId: SeasonsAttributes['seasonId'];
  episodeNumber: number;
  episodeTitle: string;
  episodeAirDate: Date;
  episodeDescription: string;
  episodeImageUrl: string;
}

const EpisodeModel = (sequelize: Sequelize) => {
  class Episode extends Model<EpisodeAttributes> implements EpisodeAttributes {
    public episodeId!: EpisodeAttributes['episodeId'];
    public seasonId!: EpisodeAttributes['seasonId'];
    public episodeNumber!: EpisodeAttributes['episodeNumber'];
    public episodeTitle!: EpisodeAttributes['episodeTitle'];
    public episodeAirDate!: EpisodeAttributes['episodeAirDate'];
    public episodeDescription!: EpisodeAttributes['episodeDescription'];
    public episodeImageUrl!: EpisodeAttributes['episodeImageUrl'];

    static associate(models: any) {
      this.belongsTo(models.Seasons, {
        foreignKey: 'seasonId',
        targetKey: 'seasonId',
        as: 'season',
      });
      this.hasMany(models.SeasonEliminations, {
        foreignKey: 'episodeId',
        sourceKey: 'episodeId',
        as: 'eliminations',
      });

      this.hasMany(models.Challenges, {
        foreignKey: 'episodeId',
        sourceKey: 'episodeId',
        as: 'challenges',
      });
    }
  }
  Episode.init(
    {
      episodeId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        field: 'EPISODE_ID',
      },
      seasonId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'SEASON_ID',
      },
      episodeNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'EPISODE_NUMBER',
      },
      episodeTitle: {
        type: DataTypes.STRING(150),
        allowNull: false,
        field: 'EPISODE_TITLE',
      },
      episodeAirDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'EPISODE_AIR_DATE',
      },
      episodeDescription: {
        type: DataTypes.STRING(500),
        allowNull: false,
        field: 'EPISODE_DESCRIPTION',
      },
      episodeImageUrl: {
        type: DataTypes.STRING(200),
        allowNull: false,
        field: 'EPISODE_IMAGE',
      },
    },
    {
      sequelize,
      tableName: 'SSN_EPISODES',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['SEASON_ID', 'EPISODE_NUMBER'],
        },
      ],
    }
  );

  return Episode;
};

export default EpisodeModel;
