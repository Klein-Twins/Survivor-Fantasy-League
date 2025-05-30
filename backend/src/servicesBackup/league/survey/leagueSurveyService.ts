import { UUID } from 'crypto';
import { EpisodeSurvey, LeagueSurvey } from '../../../generated-api';
import { LeagueAttributes } from '../../../models/league/League';
import { LeagueSurveyForEpisodeAttributes } from '../../../models/league/LeagueSurveysForEpisode';
import { EpisodeAttributes } from '../../../models/season/Episodes';
import leagueSurveyForEpisodeRepostiory from '../../../repositoriesBackup/league/survey/leagueSurveyForEpisodeRepository.ts.ts';
import episodeSurveyService from './episodeSurveyService';

const leagueSurveyService = {
  getLeagueSurvey,
};

async function getLeagueSurvey(
  leagueId: LeagueAttributes['leagueId'],
  episodeId: EpisodeAttributes['id']
): Promise<LeagueSurvey> {
  const episodeSurvey = await episodeSurveyService.getEpisodeSurvey(episodeId);
  const leagueSurveyAttributes =
    await leagueSurveyForEpisodeRepostiory.getLeagueSurveyForEpisode(
      episodeSurvey.episodeSurveyId as UUID,
      leagueId
    );

  return buildLeagueSurvey(
    episodeSurvey,
    leagueSurveyAttributes.leagueSurveyId,
    leagueId
  );
}

function buildLeagueSurvey(
  episodeSurvey: EpisodeSurvey,
  leagueSurveyId: LeagueSurveyForEpisodeAttributes['leagueSurveyId'],
  leagueId: LeagueAttributes['leagueId']
): LeagueSurvey {
  return {
    ...episodeSurvey,
    leagueSurveyId,
    leagueId,
  };
}

export default leagueSurveyService;
