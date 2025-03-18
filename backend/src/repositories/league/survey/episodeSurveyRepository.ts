import { Transaction } from 'sequelize';
import { EpisodeAttributes } from '../../../models/season/Episodes';
import { EpisodeSurveyAttributes } from '../../../models/surveyAndPick/EpisodeSurvey';
import { models } from '../../../config/db';
import { v4 as uuidv4 } from 'uuid';
import { UUID } from 'crypto';

const episodeSurveyRepository = {
  getEpisodeSurvey,
  createEpisodeSurvey,
};

async function getEpisodeSurvey(
  episodeId: EpisodeAttributes['episodeId'],
  transaction?: Transaction
): Promise<EpisodeSurveyAttributes | null> {
  const episodeSurveyAttributes = await models.EpisodeSurvey.findOne({
    where: {
      episodeId,
    },
    transaction,
  });
  return episodeSurveyAttributes;
}

async function createEpisodeSurvey(
  {
    surveyDefinitionId,
    episodeId,
    dueDate,
    openDate,
  }: {
    surveyDefinitionId: EpisodeSurveyAttributes['surveyDefinition'];
    episodeId: EpisodeAttributes['episodeId'];
    dueDate: EpisodeSurveyAttributes['dueDate'];
    openDate: EpisodeSurveyAttributes['openDate'];
  },
  transaction?: Transaction
): Promise<EpisodeSurveyAttributes> {
  let t = transaction;
  if (!transaction) {
    t = await models.sequelize.transaction();
  }
  try {
    const episodeSurveyId: UUID = uuidv4() as UUID;
    const episodeSurveyAttributes = await models.EpisodeSurvey.create(
      {
        episodeSurveyId,
        surveyDefinition: surveyDefinitionId,
        episodeId,
        dueDate,
        openDate,
      },
      { transaction }
    );
    if (!transaction && t) {
      await t.commit;
    }

    return episodeSurveyAttributes;
  } catch (error) {
    if (!transaction && t) {
      await t.rollback();
    }
    throw error;
  }
}

export default episodeSurveyRepository;
