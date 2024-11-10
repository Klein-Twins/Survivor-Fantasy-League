import { CreateLeagueRequest, CreateLeagueResponse, League } from "../../../generated-api";
import api from "../apiContainer"


const leagueService = {
    createLeague : async (name: string, seasonId: number) : Promise<CreateLeagueResponse> => {
        const apiRequest : CreateLeagueRequest = {
            name: name,
            seasonId: seasonId
        }
        try {
            return await api.league.createLeague(apiRequest);
        } catch (error) {
            console.log("Failed to create league: " + error)
            throw new Error("League Creation Failed.")
        }
    }
} 

export default leagueService;