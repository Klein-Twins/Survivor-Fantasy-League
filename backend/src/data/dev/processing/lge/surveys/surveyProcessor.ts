import { UUID } from 'crypto';
import leagueMemberSurveyService from '../../../../../services/league/survey/leagueMemberSurveyService';
import { PickIdAndPlayerChoice } from '../../../../../generated-api';
import { SurveyData } from '../../../leagueData/survey/testLeagueSurveys';

const surveyProcessor = {
  processSurveyPick,
  processSurveysForLeagueMember,
};

async function processSurveysForLeagueMember(surveyData: SurveyData) {
  const { leagueId, profileId, surveys } = surveyData;

  for (const [episodeId, pickIdsAndPlayerChoices] of surveys.entries()) {
    try {
      await processSurveyPick(
        profileId,
        leagueId as UUID,
        episodeId,
        pickIdsAndPlayerChoices
      );
    } catch (error) {
      console.error(
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
