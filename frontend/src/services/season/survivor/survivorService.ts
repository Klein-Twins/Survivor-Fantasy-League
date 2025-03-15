import { AxiosResponse } from 'axios';
import {
  CreateSurvivorRequestBody,
  CreateSurvivorResponse,
} from '../../../../generated-api';
import api from '../../apiContainer';
import { ApiRequestParams } from '../../../hooks/useApi';

const survivorService = {
  createSurvivor,
};

async function createSurvivor(
  requestData: ApiRequestParams<CreateSurvivorRequestBody, void>
): Promise<AxiosResponse<CreateSurvivorResponse>> {
  return await api.survivorService.createSurvivor(requestData.body, {
    withCredentials: true,
  });
}

export default survivorService;
