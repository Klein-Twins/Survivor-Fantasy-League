import { AxiosResponse } from 'axios';
import {
  CreateSeasonRequestBody,
  CreateSeasonResponse,
  GetSeasonsResponse,
} from '../../../generated-api';
import api from '../apiContainer';
import { ApiRequestParams } from '../../hooks/useApi';

const seasonService = {
  getSeasons,
  createSeason,
};

async function getSeasons(): Promise<AxiosResponse<GetSeasonsResponse>> {
  return await api.seasonService.getSeasons({ withCredentials: true });
}

async function createSeason(
  requestData: ApiRequestParams<CreateSeasonRequestBody, void>
): Promise<AxiosResponse<CreateSeasonResponse>> {
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
