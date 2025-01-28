import { UUID } from 'crypto';
import { DataTypes, Model, Sequelize } from 'sequelize';

export interface EpisodeAttributes {
  episodeId: UUID;
  seasonId: number;
  episodeNumber: number;
  episodeTitle: string;
  episodeAirDate: Date;
  episodeDescription: string;
  episodeImageUrl: string;
}

const EpisodeModel = (sequelize: Sequelize) => {
  class Episode extends Model<EpisodeAttributes> implements EpisodeAttributes {
    public episodeId!: UUID;
    public seasonId!: number;
    public episodeNumber!: number;
    public episodeTitle!: string;
    public episodeAirDate!: Date;
    public episodeDescription!: string;
    public episodeImageUrl!: string;

    static associate(models: any) {
      this.belongsTo(models.Seasons, { foreignKey: 'seasonId', as: 'season' });
      this.hasMany(models.ProfilePick, { foreignKey: 'episodeId', as: 'profilePick' });
    }
  }
  Episode.init(
    {
      episodeId: {
        type: DataTypes.UUID,
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
    }
  );

  return Episode;
};

export default EpisodeModel;
