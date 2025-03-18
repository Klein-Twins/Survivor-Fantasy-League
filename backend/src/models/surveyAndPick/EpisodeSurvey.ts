import { UUID } from 'crypto';
import { DataTypes, Model, Sequelize } from 'sequelize';
import { SurveyAttributes } from './Survey';
import { EpisodeAttributes } from '../season/Episodes';

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

    static associate(models: any) {}
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
        defaultValue: DataTypes.UUID,
        field: 'EPISODE_SURVEY_ID',
      },
      episodeId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
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
    }
  );

  return EpisodeSurvey;
};

export default EpisodeSurveyModel;
