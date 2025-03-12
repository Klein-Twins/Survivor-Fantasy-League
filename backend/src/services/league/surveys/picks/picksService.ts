import { Pick } from '../../../../generated-api';
import picksHelper from '../../../../helpers/league/surveys/picks/picksHelper';
import { PicksAttributes } from '../../../../models/surveyAndPick/picks/Picks';
import { SurveyAttributes } from '../../../../models/surveyAndPick/Survey';
import picksRepository from '../../../../repositories/league/surveys/picks/picksRepository';
import surveyRepository from '../../../../repositories/league/surveys/surveyRepository';

const picksService = {
  getPick,
};

async function getPick(pickId: PicksAttributes['pickId']): Promise<Pick> {
  picksHelper.validatePickId(pickId);
  return picksRepository.getPick(pickId);
}

export default picksService;
