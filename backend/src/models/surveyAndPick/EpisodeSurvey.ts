import { UUID } from 'crypto';
import { DataTypes, Model, Sequelize } from 'sequelize';
import { SurveyAttributes } from './Survey';
import { EpisodeAttributes } from '../season/Episodes';
import logger from '../../config/logger';

export interface EpisodeSurveyAttributes {
  surveyDefinition: SurveyAttributes['surveyId'];
  episodeSurveyId: UUID;
  episodeId: EpisodeAttributes['episodeId'];
  dueDate: Date;
  openDate: Date;
}

const EpisodeSurveyModel = (sequelize: Sequelize) => {
  class EpisodeSurvey
    extends Model<EpisodeSurveyAttributes>
    implements EpisodeSurveyAttributes
  {
    public surveyDefinition!: EpisodeSurveyAttributes['surveyDefinition'];
    public episodeSurveyId!: EpisodeSurveyAttributes['episodeSurveyId'];
    public episodeId!: EpisodeSurveyAttributes['episodeId'];
    public dueDate!: EpisodeSurveyAttributes['dueDate'];
    public openDate!: EpisodeSurveyAttributes['openDate'];

    static associate(models: any) {
      if (models.Survey) {
        this.belongsTo(models.Survey, {
          foreignKey: 'surveyDefinition',
          targetKey: 'surveyId',
          as: 'survey',
        });
      } else {
        logger.error('Error associating EpisodeSurvey with Survey');
      }

      if (models.Episode) {
        this.belongsTo(models.Episode, {
          foreignKey: 'episodeId',
          targetKey: 'episodeId',
          as: 'episode',
        });
      } else {
        logger.error('Error associating EpisodeSurvey with Episode');
      }

      if (models.LeagueSurveyForEpisode) {
        this.hasMany(models.LeagueSurveyForEpisode, {
          foreignKey: 'episodeSurveyId',
          sourceKey: 'episodeSurveyId',
          as: 'leagueSurveys',
        });
      }
    }
  }

  EpisodeSurvey.init(
    {
      surveyDefinition: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUID,
        field: 'SURVEY_DEFINITION_ID',
      },
      episodeSurveyId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUID,
        field: 'EPISODE_SURVEY_ID',
      },
      episodeId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'EPISODE_ID',
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'DUE_DATE',
      },
      openDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'OPEN_DATE',
      },
    },
    {
      sequelize,
      tableName: 'SUR_EPISODE_SURVEY',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['EPISODE_ID'],
        },
      ],
    }
  );

  return EpisodeSurvey;
};

export default EpisodeSurveyModel;
