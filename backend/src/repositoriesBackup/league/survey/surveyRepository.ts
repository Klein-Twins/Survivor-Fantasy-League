import { models } from '../../../config/db';
import { EpisodeSurveyAttributes } from '../../../models/surveyAndPick/EpisodeSurvey';
import { SurveyAttributes } from '../../../models/surveyAndPick/Survey';
import {
  NotFoundError,
  NotImplementedError,
} from '../../../utils/errors/errors';

const surveyRepository = {
  getSurvey,
  getSurveyDefinitionId,
};

async function getSurvey(
  surveyId: SurveyAttributes['surveyId']
): Promise<SurveyAttributes | null> {
  return await models.Survey.findByPk(surveyId);
}
async function getSurveyDefinitionId<Throws extends boolean = false>(
  field: 'episodeSurveyId' | 'episodeId',
  value: EpisodeSurveyAttributes['episodeSurveyId'],
  throwsIfNotFound?: Throws
): Promise<
  Throws extends true
    ? `${string}-${string}-${string}-${string}-${string}`
    : `${string}-${string}-${string}-${string}-${string}` | null
> {
  if (field === 'episodeSurveyId') {
    const episodeSurveyAttributes = await models.EpisodeSurvey.findByPk(value);
    if (!episodeSurveyAttributes) {
      if (throwsIfNotFound) {
        throw new NotFoundError(
          `No episode survey found for episodeSurveyId: ${value}`
        );
      }
      return null as any; // Explicitly return `null` for the `false` case
    }
    return episodeSurveyAttributes.surveyDefinition as any; // Type assertion to satisfy TypeScript
  } else if (field === 'episodeId') {
    const episodeSurveyAttributes = await models.EpisodeSurvey.findOne({
      include: [
        {
          model: models.Episode,
          required: true,
          as: 'episode',
          where: {
            id: value,
          },
        },
      ],
    });
    if (!episodeSurveyAttributes) {
      if (throwsIfNotFound) {
        throw new NotFoundError(
          `No episode survey found for episodeId: ${value}`
        );
      }
      return null as any; // Explicitly return `null` for the `false` case
    }
    return episodeSurveyAttributes.surveyDefinition as any; // Type assertion to satisfy TypeScript
  } else {
    throw new NotImplementedError(
      'surveyRepository.getSurveyDefinitionId not implemented for field: ' +
        field
    );
  }
}

export default surveyRepository;
