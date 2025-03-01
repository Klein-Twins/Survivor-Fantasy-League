import { AxiosResponse } from 'axios';
import {
  CreateSeasonRequestBody,
  CreateSeasonResponse,
  GetSeasonsResponse,
  SeasonServiceApi,
} from '../../../generated-api';
import api from '../apiContainer';
import { ApiRequestParams } from '../../hooks/useApi';

export interface GetSeasonsRequestParams {
  seasonId?: number;
}

const seasonService = { getSeasons, createSeason };

async function getSeasons(): Promise<AxiosResponse<GetSeasonsResponse>> {
  return await api.seasonService.getSeasons();
}

async function createSeason(
  requestData: ApiRequestParams<CreateSeasonRequestBody, void>
): Promise<AxiosResponse<CreateSeasonResponse>> {
  if (!requestData.body) {
    throw new Error('Request body is required');
  }

  const response = await api.seasonService.createSeasonForm(
    requestData.body.seasonNumber,
    requestData.body.isActive,
    requestData.body.theme,
    requestData.body.location,
    requestData.body.name,
    requestData.body.numberOfContestants,
    requestData.body.startDate,
    requestData.body.endDate,
    requestData.body.seasonLogo,
    {
      withCredentials: true,
    }
  );
  return response;
}

export default seasonService;
