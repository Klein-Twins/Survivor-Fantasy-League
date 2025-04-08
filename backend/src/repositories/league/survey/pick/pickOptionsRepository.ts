import { models } from '../../../../config/db';
import { PickOptionsAttributes } from '../../../../models/surveyAndPick/picks/PickOptions';
import { PicksAttributes } from '../../../../models/surveyAndPick/picks/Picks';
import { InternalServerError } from '../../../../utils/errors/errors';

const PickOptionsRepository = {
  getPickOptions,
};

async function getPickOptions(
  pickId: PicksAttributes['pickId']
): Promise<PickOptionsAttributes> {
  const pickOptionsAttributes = await models.PickOptions.findByPk(pickId);
  if (!pickOptionsAttributes) {
    throw new InternalServerError(
      `Pick options not found for pickId: ${pickId}`
    );
  }
  return pickOptionsAttributes;
}

export default PickOptionsRepository;
