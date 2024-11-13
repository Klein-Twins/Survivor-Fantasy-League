import { LeagueAttributes } from "../../models/League";
import { CreateLeagueResponse } from "../../types/league/leagueDto";

const leagueResponseBuilder = {
    buildCreateLeagueResponse : (league: LeagueAttributes,) : CreateLeagueResponse => {
        const response : CreateLeagueResponse = {
            league: league,
            statusCode: 201,
            message: 'League successfully created.'
        }
        return response;
    }
}

export default leagueResponseBuilder; 