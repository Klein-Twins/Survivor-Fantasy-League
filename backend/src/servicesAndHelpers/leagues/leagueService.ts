import { models } from "../../config/db";
import { LeagueAttributes } from "../../models/Leagues";
import leagueRepository from "../../repositories/leagueRepository";
import { CreateLeagueResponse } from "../../types/league/leagueDto";
import leagueResponseFormatter from "../../utils/apiResponseFormatters/leagueResponseFormatter";

const leagueService = {
    createLeague: async (seasonId: number, leagueName: string): Promise<CreateLeagueResponse> => {
        const league: LeagueAttributes = await leagueRepository.createLeague(seasonId, leagueName)
        leagueResponseFormatter.formatCreateLeagueResponse(
            201,
            'League successfully created',
            
        )
    }
};

export default leagueService;
