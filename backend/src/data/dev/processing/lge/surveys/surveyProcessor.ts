import { UUID } from 'crypto';
import leagueMemberSurveyService from '../../../../../services/league/survey/leagueMemberSurveyService';
import { PickIdAndPlayerChoice } from '../../../../../generated-api';
import season48TestLeagues from '../../../leagueData/leagues48';
import { LeagueMemberSurvey } from '../../../leagueData/survey/testLeagueSurveys';
import { ProfileAttributes } from '../../../../../models/account/Profile';
import { LeagueAttributes } from '../../../../../models/league/League';
import { EpisodeAttributes } from '../../../../../models/season/Episodes';
import logger from '../../../../../config/logger';

const surveyProcessor = {
  processSurveyPick,
  processSurveysForLeagueMember,
  processSurveysForEpisode,
};

async function processSurveysForEpisode(episodeId: UUID) {
  const season48Leagues = season48TestLeagues;

  for (const league of Object.values(season48Leagues)) {
    logger.debug('Processing surveys for league:', league.name);
    const episodeSurveyDataMap = league.episodeSurveyData;

    const episodeSurveysForLeageu = episodeSurveyDataMap.get(episodeId);
    if (!episodeSurveysForLeageu) {
      console.warn(
        `No survey data found for episodeId: ${episodeId} in league: ${league.name}`
      );
      continue;
    }
    for (const leagueMember of league.leagueMembers) {
      const profileId = leagueMember.profileId;
      const leagueMemberSurveyForLeagueMemberAndEpisode =
        episodeSurveysForLeageu.get(profileId);

      if (!leagueMemberSurveyForLeagueMemberAndEpisode) {
        console.warn(
          `No survey data found for profileId: ${profileId} in league: ${league.name} for episodeId: ${episodeId}`
        );
        continue;
      }

      await processSurveysForLeagueMember(
        profileId,
        episodeId,
        league.leagueId,
        leagueMemberSurveyForLeagueMemberAndEpisode
      );
    }
  }
}

async function processSurveysForLeagueMember(
  profileId: ProfileAttributes['profileId'],
  episodeId: EpisodeAttributes['id'],
  leagueId: LeagueAttributes['leagueId'],
  surveyData: LeagueMemberSurvey
) {
  for (const pickIdAndChoice of surveyData) {
    try {
      await processSurveyPick(
        profileId,
        leagueId as UUID,
        episodeId,
        surveyData
      );
    } catch (error) {
      logger.error(
        `Error processing survey for leagueId: ${leagueId}, profileId: ${profileId}, episodeId: ${episodeId}`,
        error
      );
    }
  }
}

async function processSurveyPick(
  profileId: UUID,
  leagueId: UUID,
  episodeId: UUID,
  playerChoices: PickIdAndPlayerChoice[]
) {
  const leagueSurvey = await leagueMemberSurveyService.getLeagueMemberSurvey(
    leagueId,
    profileId,
    episodeId
  );

  if (!leagueSurvey) {
    throw new Error(`League survey not found for leagueId: ${leagueId}`);
  }

  await leagueMemberSurveyService.submitLeagueSurvey(
    {
      surveyId: leagueSurvey.surveyDefinitionId as UUID,
      leagueId: leagueSurvey.leagueId,
      leagueProfileId: leagueSurvey.leagueProfileId as UUID,
      episodeId: leagueSurvey.episodeId as UUID,
      leagueSurveyId: leagueSurvey.leagueSurveyId as UUID,
      picksWithChoice: playerChoices,
    },
    {
      ignoreSurveyAvailability: true,
      ignoreSurveyCompleteness: true,
    }
  );
}

export default surveyProcessor;
