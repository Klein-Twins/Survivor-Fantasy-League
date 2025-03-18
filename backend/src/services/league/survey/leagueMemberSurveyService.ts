import { UUID } from 'crypto';
import {
  CompletedLeagueMemberSurvey,
  LeagueMemberSurvey,
  LeagueSurvey,
  SurveySubmissionStatus,
} from '../../../generated-api';
import { ProfileAttributes } from '../../../models/account/Profile';
import { LeagueAttributes } from '../../../models/league/League';
import { EpisodeAttributes } from '../../../models/season/Episodes';
import episodeService from '../../season/episodeService';
import leagueMemberService from '../leagueMemberService';
import leagueService from '../leagueService';
import leagueSurveyService from './leagueSurveyService.ts';
import surveySubmissionService from './surveySubmissionService.ts';

const leagueMemberSurveyService = {
  getLeagueMemberSurvey,
};

async function getLeagueMemberSurvey(
  leagueId: LeagueAttributes['leagueId'],
  profileId: ProfileAttributes['profileId'],
  episodeId: EpisodeAttributes['episodeId']
): Promise<LeagueMemberSurvey | CompletedLeagueMemberSurvey> {
  //Validate leagueId exists
  const league = await leagueService.getLeague(leagueId);
  //Validate profileId is in league
  const leagueMember = await leagueMemberService.getEnrolledLeagueMember(
    leagueId,
    profileId
  );
  //Validate episodeId is in season
  const episode = await episodeService.getEpisode('seasonIdAndEpisodeId', {
    seasonId: league.seasonId,
    episodeId,
  });

  const leagueSurvey = await leagueSurveyService.getLeagueSurvey(
    leagueId,
    episodeId
  );

  const submissionStatus =
    (await surveySubmissionService.didLeagueMemberSubmitSurvey(
      leagueSurvey.leagueSurveyId as UUID,
      leagueMember.leagueProfileId
    ))
      ? SurveySubmissionStatus.Submitted
      : SurveySubmissionStatus.NotSubmitted;

  const leagueMemberSurvey = buildLeagueMemberSurvey(
    leagueSurvey,
    leagueMember.leagueProfileId,
    submissionStatus
  );

  return leagueMemberSurvey;
}

function buildLeagueMemberSurvey(
  leagueSurvey: LeagueSurvey,
  leagueProfileId: string,
  submissionStatus: SurveySubmissionStatus
): LeagueMemberSurvey {
  return {
    ...leagueSurvey,
    leagueProfileId,
    submissionStatus,
  };
}
export default leagueMemberSurveyService;
