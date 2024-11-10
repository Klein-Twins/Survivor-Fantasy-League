import { LeagueAttributes } from "../../models/Leagues";
import { SeasonsAttributes } from "../../models/Seasons";
import { CreateLeagueResponse } from "../../types/league/leagueDto";

const leagueResponseBuilder = {
    buildCreateLeagueResponse : (league: LeagueAttributes, season: SeasonsAttributes) : CreateLeagueResponse => {
        const response : CreateLeagueResponse = {
            league: {
                leagueId: league.LEAGUE_ID,
                name: league.NAME,
                season: {
                    seasonId: season.SEASON_ID,
                    seasonNumber: season.SEASON_ID,
                    seasonStart: "",
                    seasonEnd: ""
                }
            },
            statusCode: 200,
            message: 'League successfully created.'
        }
        return response;
    }
}

export default leagueResponseBuilder; 