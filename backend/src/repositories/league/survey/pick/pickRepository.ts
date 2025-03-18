import { models } from '../../../../config/db';
import { PicksAttributes } from '../../../../models/surveyAndPick/picks/Picks';

const pickRepository = {
  getPick,
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

export default pickRepository;
