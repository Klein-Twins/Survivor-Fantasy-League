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

const config = new Configuration({
  basePath: 'http://localhost:3000',
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
