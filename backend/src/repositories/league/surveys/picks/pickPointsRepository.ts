import { models } from '../../../../config/db';
import logger from '../../../../config/logger';
import { PickPointsAttributes } from '../../../../models/surveysAndPicks/picks/PickPoints';
import { PicksAttributes } from '../../../../models/surveysAndPicks/picks/Picks';

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
