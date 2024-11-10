import { CreateLeagueResponse, LeagueWithDetails } from "../../types/league/leagueDto";
import formatAPIResponse from "./apiResponseFormatter";

const leagueResponseFormatter = {
    formatCreateLeagueResponse: (
        statusCode: number,
        message: string,
        league: LeagueWithDetails
    ): CreateLeagueResponse => {
        return {
            ...formatAPIResponse(statusCode, message),
            league: league
        }
    },
};

export default leagueResponseFormatter;