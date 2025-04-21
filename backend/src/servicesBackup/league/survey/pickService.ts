import { Pick, PickOptions } from '../../../generated-api';
import { EpisodeAttributes } from '../../../models/season/Episodes';
import { PicksAttributes } from '../../../models/surveyAndPick/picks/Picks';
import { SurveyAttributes } from '../../../models/surveyAndPick/Survey';
import pickRepository from '../../../repositoriesBackup/league/survey/pick/pickRepository';
import surveyPicksRepository from '../../../repositoriesBackup/league/survey/pick/surveyPicksRepository';
import surveyRepository from '../../../repositoriesBackup/league/survey/surveyRepository';
import { NotFoundError } from '../../../utils/errors/errors';
import pickOptionService from './pickOptionService';

const pickService = {
  getPick,
  getPicksForSurvey,
  validatePicksAreInSurvey,
};

async function getPick(
  pickId: PicksAttributes['pickId'],
  episodeId: EpisodeAttributes['id']
): Promise<Pick> {
  const pickAttributes = await pickRepository.getPick(pickId);
  if (!pickAttributes) {
    throw new NotFoundError(`Pick not found for pickId: ${pickId}`);
  }
  const pickOptions = await pickOptionService.getPickOptions(pickId, episodeId);

  return buildPick(pickAttributes, pickOptions);
}

async function getPicksForSurvey(
  surveyId: SurveyAttributes['surveyId'],
  episodeId: EpisodeAttributes['id']
): Promise<Pick[]> {
  const surveyPicksAttributes = await surveyPicksRepository.getSurveyPicks(
    surveyId
  );
  if (surveyPicksAttributes.length === 0) {
    throw new NotFoundError(`No picks found for surveyId: ${surveyId}`);
  }

  const picks: Pick[] = await Promise.all(
    surveyPicksAttributes.map(async (surveyPickAttributes) => {
      return await getPick(surveyPickAttributes.pickId, episodeId);
    })
  );

  return picks;
}

async function validatePicksAreInSurvey<Throws extends boolean = false>(
  pickIds: PicksAttributes['pickId'][],
  episodeId: EpisodeAttributes['id'],
  throws: Throws
): Promise<boolean> {
  const surveyDefinitionId = await surveyRepository.getSurveyDefinitionId(
    'episodeId',
    episodeId,
    throws
  );

  const pickIdsInSurvey = await pickRepository.getPickIdsInSurveyDefinition(
    surveyDefinitionId!,
    throws
  );

  const picksNotInSurvey: Pick['id'][] = [];
  pickIds.forEach((pickId) => {
    if (!pickIdsInSurvey.includes(pickId)) {
      picksNotInSurvey.push(pickId);
    }
  });

  const missingSurveyPicks: Pick['id'][] = [];
  pickIdsInSurvey.forEach((pickId) => {
    if (!pickIds.includes(pickId)) {
      missingSurveyPicks.push(pickId);
    }
  });

  if (picksNotInSurvey.length > 0 && missingSurveyPicks.length > 0) {
    if (throws) {
      throw new NotFoundError(
        `Picks not found in survey: ${picksNotInSurvey.join(
          ', '
        )} and missing picks: ${missingSurveyPicks.join(', ')}`
      );
    }
    return false;
  } else if (picksNotInSurvey.length > 0) {
    if (throws) {
      throw new NotFoundError(
        `Picks not found in survey: ${picksNotInSurvey.join(', ')}`
      );
    }
    return false;
  } else if (missingSurveyPicks.length > 0) {
    if (throws) {
      throw new NotFoundError(
        `Picks not found in survey: ${missingSurveyPicks.join(', ')}`
      );
    }
    return false;
  } else {
    return true;
  }
}

function buildPick(
  pickAttributes: PicksAttributes,
  pickOptions: PickOptions
): Pick {
  return {
    id: pickAttributes.pickId,
    description: pickAttributes.description,
    pointValue: 5,
    options: pickOptions,
  };
}

export default pickService;
