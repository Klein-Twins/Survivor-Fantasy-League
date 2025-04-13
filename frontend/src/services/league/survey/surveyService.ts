import { AxiosResponse } from 'axios';
import {
  Episode,
  GetLeagueMemberSurveyResponse,
  League,
  LeagueSurvey,
  PickIdAndPlayerChoice,
  Profile,
  SubmitSurveyRequestBody,
  SubmitSurveyResponse,
} from '../../../../generated-api';
import { ApiRequestParams } from '../../../hooks/useApi';
import api from '../../apiContainer';
import { SurveyPickChoicesMap } from '../../../hooks/survey/useSurvey';

const surveyService = {
  getLeagueSurvey,
  submitLeagueSurvey,
};

export interface GetLeagueSurveyRequestParams {
  leagueId: League['id'];
  profileId: Profile['profileId'];
  episodeId: Episode['id'];
}

async function getLeagueSurvey(
  requestData: ApiRequestParams<void, GetLeagueSurveyRequestParams>
): Promise<AxiosResponse<GetLeagueMemberSurveyResponse>> {
  const response: AxiosResponse<GetLeagueMemberSurveyResponse> =
    await api.surveyService.getLeagueSurvey(
      requestData.queryParams.leagueId,
      requestData.queryParams.profileId,
      requestData.queryParams.episodeId,
      {
        withCredentials: true,
      }
    );
  return response;
}

async function submitLeagueSurvey(surveyData: {
  episodeId: Episode['id'];
  leagueSurveyId: LeagueSurvey['leagueSurveyId'];
  leagueId: League['id'];
  surveyId: LeagueSurvey['surveyDefinitionId'];
  profileId: Profile['profileId'];
  surveyChoicesMap: SurveyPickChoicesMap;
}): Promise<AxiosResponse<SubmitSurveyResponse>> {
  // For each pick, map the choices to an array of IDs
  const picksWithChoices: PickIdAndPlayerChoice[] = Array.from(
    surveyData.surveyChoicesMap.entries()
  ).map(([pickId, playerChoices]) => ({
    pickId,
    choice: playerChoices.map((choice) => choice.id as string), // Extract the `id` as a string
  }));

  const requestBody: SubmitSurveyRequestBody = {
    episodeId: surveyData.episodeId,
    leagueSurveyId: surveyData.leagueSurveyId,
    surveyId: surveyData.surveyId,
    leagueId: surveyData.leagueId,
    profileId: surveyData.profileId,
    picksWithChoice: picksWithChoices, // Corrected property name
  };

  const response: AxiosResponse<SubmitSurveyResponse> =
    await api.surveyService.submitSurveyWithPickChoices(requestBody, {
      withCredentials: true,
    });
  return response;
}

export default surveyService;
