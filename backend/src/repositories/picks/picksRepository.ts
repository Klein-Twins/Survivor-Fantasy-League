import { models } from '../../config/db';
import { Pick, SurveyType } from '../../generated-api';
import { PicksAttributes } from '../../models/picks/PCK_PICKS';

const picksRepository = {
  getLeaguePicks,
};

async function getLeaguePicks(leagueId: string, surveyType: SurveyType): Promise<Pick[]> {
  const test = leagueId;

  const allPicksAttributes: PicksAttributes[] = await models.Picks.findAll({
    where: {},
  });
}

export default picksRepository;
