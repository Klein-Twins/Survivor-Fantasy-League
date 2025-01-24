import { Configuration, LeagueInviteServiceApi, LeagueServiceApi, ProfileServiceApi, SurvivorServiceApi, UserSessionServiceApi } from "../../generated-api";

const config = new Configuration({
    basePath: 'http://localhost:3000'
});

const api = {
    leagueService: new LeagueServiceApi(config),
    profileService: new ProfileServiceApi(config),
    leagueInviteService: new LeagueInviteServiceApi(config),
    survivorService: new SurvivorServiceApi(config),
    UserSessionServiceApi: new UserSessionServiceApi(config),
}
export default api;
