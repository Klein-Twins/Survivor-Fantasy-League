import {
  Configuration,
  ImageServiceApi,
  LeagueInviteServiceApi,
  LeagueServiceApi,
  ProfileServiceApi,
  SeasonServiceApi,
  SurveyServiceApi,
  SurvivorServiceApi,
  TribeServiceApi,
  UserSessionServiceApi,
} from '../../generated-api';
import { NODE_ENV } from '../config/config';

let basePath = 'http://localhost:3000';
if (NODE_ENV === 'deployed') {
  basePath = 'http://134.199.141.129:3000';
}

console.log('API base path   :', basePath);
const config = new Configuration({
  basePath,
});

const api = {
  leagueService: new LeagueServiceApi(config),
  profileService: new ProfileServiceApi(config),
  leagueInviteService: new LeagueInviteServiceApi(config),
  survivorService: new SurvivorServiceApi(config),
  userSessionServiceApi: new UserSessionServiceApi(config),
  imageServiceApi: new ImageServiceApi(config),
  surveyService: new SurveyServiceApi(config),
  seasonService: new SeasonServiceApi(config),
  tribeService: new TribeServiceApi(config),
};
export default api;
