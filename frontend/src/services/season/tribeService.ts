import { AxiosResponse } from 'axios';
import { CreateTribeResponse } from '../../../generated-api';
import api from '../apiContainer';
import { TribeFormData } from '../../utils/admin/TribeFormData';

const tribeService = {
  createTribe,
};

async function createTribe(
  seasonId: number,
  tribeData: TribeFormData
): Promise<AxiosResponse<CreateTribeResponse>> {
  console.log('In create tribe');
  console.log(tribeData);
  const response = await api.tribeService.createTribe({
    seasonId,
    name: tribeData.name,
    isMergeTribe: tribeData.isMergeTribe,
    episodeStarted: tribeData.episodeStarted,
    color: {
      color: tribeData.color,
      hex: '#000000',
    },
  });
  return response;
}

export default tribeService;
