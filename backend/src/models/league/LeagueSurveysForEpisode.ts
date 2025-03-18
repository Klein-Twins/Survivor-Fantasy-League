import { UUID } from 'crypto';
import { DataTypes, Model, Sequelize } from 'sequelize';
import { LeagueAttributes } from './League';
import { EpisodeSurveyAttributes } from '../surveyAndPick/EpisodeSurvey';

export interface LeagueSurveyForEpisodeAttributes {
  leagueSurveyId: UUID;
  episodeSurveyId: EpisodeSurveyAttributes['episodeId'];
  leagueId: LeagueAttributes['leagueId'];
}

const LeagueSurveyForEpisodeModel = (sequelize: Sequelize) => {
  class LeagueSurveyForEpisode
    extends Model<LeagueSurveyForEpisodeAttributes>
    implements LeagueSurveyForEpisodeAttributes
  {
    public leagueSurveyId!: LeagueSurveyForEpisodeAttributes['leagueSurveyId'];
    public episodeSurveyId!: LeagueSurveyForEpisodeAttributes['episodeSurveyId'];
    public leagueId!: LeagueSurveyForEpisodeAttributes['leagueId'];

    static associate(models: any) {
      //TODO: Add associations
      // this.belongsTo(models.Survey, { foreignKey: 'surveyId', as: 'survey' });
      // this.belongsTo(models.League, { foreignKey: 'leagueId', as: 'league' });
      // this.belongsTo(models.Episode, { foreignKey: 'episodeId', as: 'episode' });
    }
  }

  LeagueSurveyForEpisode.init(
    {
      leagueSurveyId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'LEAGUE_SURVEY_ID',
      },
      episodeSurveyId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'EPISODE_SURVEY_ID',
      },
      leagueId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'LEAGUE_ID',
      },
    },
    {
      sequelize,
      tableName: 'LGE_LEAGUE_SURVEYS',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['LEAGUE_ID', 'EPISODE_SURVEY_ID'],
        },
      ],
    }
  );

  return LeagueSurveyForEpisode;
};

export default LeagueSurveyForEpisodeModel;
