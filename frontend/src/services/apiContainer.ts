import { LeagueApi, SurvivorsApi, AuthenticationApi, Configuration } from "../../generated-api/index"

const config = new Configuration({
    basePath: 'http://localhost:3000'
});

const api = {
    league: new LeagueApi(config)
}
export default api;
