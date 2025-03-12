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
  let basePath = 'http://134.199.141.129:3000';
}

console.log('API base path:', basePath);
const config = new Configuration({
  basePath,
});

const api = {
  leagueService: new LeagueServiceApi(config),
  profileService: new ProfileServiceApi(config),
  leagueInviteService: new LeagueInviteServiceApi(config),
  survivorService: new SurvivorServiceApi(config),
  UserSessionServiceApi: new UserSessionServiceApi(config),
  ImageServiceApi: new ImageServiceApi(config),
  LeagueSurveyService: new SurveyServiceApi(config),
  seasonService: new SeasonServiceApi(config),
  tribeService: new TribeServiceApi(config),
};
export default api;
