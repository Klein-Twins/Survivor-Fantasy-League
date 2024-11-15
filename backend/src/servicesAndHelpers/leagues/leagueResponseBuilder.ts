import { LeagueAttributes } from "../../models/League";
import { CreateLeagueResponse, GetLeaguesForProfileResponse } from "../../types/league/leagueDto";

const leagueResponseBuilder = {
    buildCreateLeagueResponse : (league: LeagueAttributes,) : CreateLeagueResponse => {
        const response : CreateLeagueResponse = {
            league: league,
            statusCode: 201,
            message: 'League successfully created.'
        }
        return response;
    },
    buildGetLeaguesForProfileResponse: (leagues: LeagueAttributes[]): GetLeaguesForProfileResponse => {
        const response: GetLeaguesForProfileResponse = {
            leagues: leagues,
            statusCode: 200,
            message: 'Leagues successfully fetched'
        }
        return response;
    }
}

export default leagueResponseBuilder; 