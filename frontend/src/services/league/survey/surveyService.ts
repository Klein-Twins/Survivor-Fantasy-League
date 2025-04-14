import { AxiosResponse } from 'axios';
import {
  Episode,
  GetLeagueMemberSurveyResponse,
  GetLeagueMemberSurveysResponse,
  League,
  Profile,
  SubmitSurveyRequestBody,
  SubmitSurveyResponse,
} from '../../../../generated-api';
import { ApiRequestParams } from '../../../hooks/useApi';
import api from '../../apiContainer';

const surveyService = {
  getLeagueSurvey,
  getLeagueSurveys,
  submitLeagueSurvey,
};

export interface GetLeagueSurveyRequestParams {
  leagueId: League['id'];
  profileId: Profile['profileId'];
  episodeId: Episode['id'];
}

export interface GetLeagueSurveysRequestParams {
  leagueId: League['id'];
  profileId: Profile['profileId'];
}

async function getLeagueSurveys(
  requestData: ApiRequestParams<void, GetLeagueSurveysRequestParams>
): Promise<AxiosResponse<GetLeagueMemberSurveysResponse>> {
  const response: AxiosResponse<GetLeagueMemberSurveysResponse> =
    await api.surveyService.getLeagueSurveys(
      requestData.queryParams.leagueId,
      requestData.queryParams.profileId,
      {
        withCredentials: true,
      }
    );
  return response;
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

async function submitLeagueSurvey(
  requestData: ApiRequestParams<SubmitSurveyRequestBody, void>
): Promise<AxiosResponse<SubmitSurveyResponse>> {
  const response: AxiosResponse<SubmitSurveyResponse> =
    await api.surveyService.submitSurveyWithPickChoices(requestData.body, {
      withCredentials: true,
    });
  return response;
}

// async function submitLeagueSurvey(surveyData: {
//   episodeId: Episode['id'];
//   leagueSurveyId: LeagueSurvey['leagueSurveyId'];
//   leagueId: League['id'];
//   surveyId: LeagueSurvey['surveyDefinitionId'];
//   profileId: Profile['profileId'];
//   surveyChoicesMap: SurveyPickChoicesMap;
// }): Promise<AxiosResponse<SubmitSurveyResponse>> {
//   // For each pick, map the choices to an array of IDs
//   const picksWithChoices: PickIdAndPlayerChoice[] = Array.from(
//     surveyData.surveyChoicesMap.entries()
//   ).map(([pickId, playerChoices]) => ({
//     pickId,
//     choice: playerChoices.map((choice) => choice.id as string), // Extract the `id` as a string
//   }));

//   const requestBody: SubmitSurveyRequestBody = {
//     episodeId: surveyData.episodeId,
//     leagueSurveyId: surveyData.leagueSurveyId,
//     surveyId: surveyData.surveyId,
//     leagueId: surveyData.leagueId,
//     profileId: surveyData.profileId,
//     picksWithChoice: picksWithChoices, // Corrected property name
//   };

//   const response: AxiosResponse<SubmitSurveyResponse> =
//     await api.surveyService.submitSurveyWithPickChoices(requestBody, {
//       withCredentials: true,
//     });
//   return response;
// }

export default surveyService;
