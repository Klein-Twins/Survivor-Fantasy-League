import { Pick } from '../../../../generated-api';
import picksHelper from '../../../../helpers/league/surveys/picks/picksHelper';
import { PicksAttributes } from '../../../../models/surveysAndPicks/picks/Picks';
import picksRepository from '../../../../repositories/league/surveys/picks/picksRepository';

const picksService = {
  getPick,
};

async function getPick(pickId: PicksAttributes['pickId']): Promise<Pick> {
  picksHelper.validatePickId(pickId);
  return picksRepository.getPick(pickId);
}

export default picksService;
