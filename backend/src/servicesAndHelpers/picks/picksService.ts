import { Pick, SurveyType } from '../../generated-api';
import picksRepository from '../../repositories/picks/picksRepository';

const picksService = {
  getPickById,
};

async function getPickById(pickId: string): Promise<Pick> {
  return picksRepository.getPickById(pickId);
}

export default picksService;
