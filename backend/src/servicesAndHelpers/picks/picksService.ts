import { Pick, SurveyType } from '../../generated-api';
import picksRepository from '../../repositories/picks/picksRepository';

const picksService = {
  getLeaguePicks,
};

async function getLeaguePicks(leagueId: string, surveyType: SurveyType): Promise<Pick[]> {
  const picks: Pick[] = await picksRepository.getLeaguePicks(leagueId, surveyType);

  return picks;
}

export default picksService;
