import { models } from '../../../../config/db';
import { PicksAttributes } from '../../../../models/surveyAndPick/picks/Picks';
import { SurveyAttributes } from '../../../../models/surveyAndPick/Survey';
import { NotFoundError } from '../../../../utils/errors/errors';

const pickRepository = {
  getPick,
  getPickIdsInSurveyDefinition,
};

async function getPick(
  pickId: PicksAttributes['pickId']
): Promise<PicksAttributes | null> {
  return await models.Picks.findOne({
    where: {
      pickId,
    },
  });
}

async function getPickIdsInSurveyDefinition<Throws extends boolean = false>(
  surveyDefinitionId: SurveyAttributes['surveyId'],
  throwsIfNotFound?: Throws
): Promise<PicksAttributes['pickId'][]> {
  const foundPicks = await models.SurveyPicks.findAll({
    where: {
      surveyId: surveyDefinitionId,
    },
  });
  if (foundPicks.length === 0 && throwsIfNotFound) {
    throw new NotFoundError(
      `No picks found for surveyDefinitionId: ${surveyDefinitionId}`
    );
  }
  return foundPicks.map((pick) => pick.pickId);
}

export default pickRepository;
