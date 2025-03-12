import { models } from '../../../../config/db';
import logger from '../../../../config/logger';
import { PickPointsAttributes } from '../../../../models/surveyAndPick/picks/PickPoints';
import { PicksAttributes } from '../../../../models/surveyAndPick/picks/Picks';

const pickPointsRepository = {
  getPickPoints,
};

async function getPickPoints(
  pickId: PicksAttributes['pickId']
): Promise<number> {
  const pickPointsAttributes: PickPointsAttributes | null =
    await models.PickPoints.findOne({
      where: {
        pickId,
      },
    });
  if (!pickPointsAttributes) {
    logger.warn(`PickPoints not found for pickId: ${pickId}`);
  }
  return pickPointsAttributes?.points || 5;
}

export default pickPointsRepository;
