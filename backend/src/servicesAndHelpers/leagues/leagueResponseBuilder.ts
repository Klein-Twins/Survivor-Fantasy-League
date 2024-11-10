import { LeagueAttributes } from "../../models/Leagues";
import { CreateLeagueResponse } from "../../types/league/leagueDto";

const leagueResponseBuilder = {
    buildCreateLeagueResponse : (league: LeagueAttributes,) : CreateLeagueResponse => {
        const response : CreateLeagueResponse = {
            LEAGUE: league,
            statusCode: 201,
            message: 'League successfully created.'
        }
        return response;
    }
}

export default leagueResponseBuilder; 