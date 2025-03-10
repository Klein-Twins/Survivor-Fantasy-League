import {
  Episode,
  GetSurveyForEpisodeForLeagueMemberResponseData,
  League,
  LeagueSurvey,
} from '../../../generated-api';
import leagueMemberHelper from '../../../helpers/league/leagueMemberHelper';
import { ProfileAttributes } from '../../../models/account/Profile';
import { LeagueAttributes } from '../../../models/league/League';
import { EpisodeAttributes } from '../../../models/season/Episodes';
import surveyRepository from '../../../repositories/league/surveys/surveyRepository';
import episodeService from '../../season/episodeService';
import leagueService from '../leagueService';

const surveyService = {
  getSurveys,
};

async function getSurveys(
  leagueId: LeagueAttributes['leagueId'],
  profileIds: ProfileAttributes['profileId'][],
  episodeIds: EpisodeAttributes['episodeId'][]
): Promise<GetSurveyForEpisodeForLeagueMemberResponseData> {
  const league: League = await leagueService.getLeague(leagueId);

  profileIds.map(async (profileId) => {
    await leagueMemberHelper.validateProfileIsInLeague(leagueId, profileId);
  });

  const seasonId = league.season.id;

  const episodes: Episode[] = await episodeService.getEpisodes(episodeIds);

  let surveys: LeagueSurvey[] = [];
  for (const profileId of profileIds) {
    for (const episode of episodes) {
      surveys = surveys.concat(
        await surveyRepository.getSurvey(leagueId, profileId, episode.id)
      );
    }
  }

  return { leagueSurveys: surveys };
}

export default surveyService;
