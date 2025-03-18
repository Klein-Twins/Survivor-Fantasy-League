import { AxiosResponse } from 'axios';
import {
  CreateTribeRequestBody,
  CreateTribeResponse,
} from '../../../../generated-api';
import { ApiRequestParams } from '../../../hooks/useApi';
import api from '../../apiContainer';

const tribeService = {
  createTribe,
};

async function createTribe(
  seasonId: number,
  requestData: ApiRequestParams<CreateTribeRequestBody, void>
): Promise<AxiosResponse<CreateTribeResponse>> {
  return await api.tribeService.createTribe(requestData.body, {
    withCredentials: true,
  });
}

export default tribeService;
