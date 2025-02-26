import { AxiosResponse } from 'axios';
import { GetSeasonsResponse, SeasonServiceApi } from '../../../generated-api';
import api from '../apiContainer';

export interface GetSeasonsRequestParams {
  seasonId?: number;
}

const seasonService = { getSeasons };

async function getSeasons(): Promise<AxiosResponse<GetSeasonsResponse>> {
  return await api.seasonService.getSeasons();
}

export default seasonService;
