import { models } from '../../../../config/db';
import { Pick } from '../../../../generated-api';
import picksHelper from '../../../../helpers/league/surveys/picks/picksHelper';
import { PicksAttributes } from '../../../../models/surveysAndPicks/picks/Picks';
import { NotFoundError } from '../../../../utils/errors/errors';
import pickPointsRepository from './pickPointsRepository';
import pickOptionsRepository from './picksOptionsRepository';

const picksRepository = {
  getPick,
};

async function getPick(pickId: PicksAttributes['pickId']): Promise<Pick> {
  picksHelper.validatePickId(pickId);
  const pickAttributes = await models.Picks.findOne({
    where: {
      pickId,
    },
  });

  if (!pickAttributes) {
    throw new NotFoundError(`Pick not found for pickId: ${pickId}`);
  }

  const pickPoints: number = await pickPointsRepository.getPickPoints(pickId);

  //TODO - Change 47 hardcoded value
  const pickOptions = await pickOptionsRepository.getPickOptions(
    pickAttributes.type,
    47
  );

  return picksHelper.buildPick(pickAttributes, pickOptions, pickPoints);
}

export default picksRepository;
