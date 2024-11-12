import { CreateLeagueRequest, CreateLeagueResponse } from "../../../generated-api";
import api from "../apiContainer"


const leagueService = {
    createLeague : async (name: string, seasonId: number) : Promise<CreateLeagueResponse> => {
        const apiRequest : CreateLeagueRequest = {
            name: name,
            seasonId: seasonId
        }
            return (await api.league.createLeague(apiRequest)).data;

    }
} 

export default leagueService;