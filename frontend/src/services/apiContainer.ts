import { LeagueApi, SurvivorsApi, AuthenticationApi, Configuration, ProfileApi } from "../../generated-api/index"

const config = new Configuration({
    basePath: 'http://localhost:3000'
});

const api = {
    league: new LeagueApi(config),
    profile: new ProfileApi(config),
}
export default api;
