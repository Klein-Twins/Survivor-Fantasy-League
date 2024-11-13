import { models } from "../../config/db";
import { NOT_FOUND_ERROR } from "../../constants/auth/responseErrorConstants";
import { LeagueAttributes } from "../../models/League";
import leagueRepository from "../../repositories/leagueRepository";
import { CreateLeagueResponse } from "../../types/league/leagueDto";
import errorFactory from "../../utils/errors/errorFactory";
import { NotFoundError } from "../../utils/errors/errors";
import leagueResponseBuilder from "./leagueResponseBuilder";

const leagueService = {
    createLeague: async (seasonId: number, leagueName: string): Promise<LeagueAttributes> => {
        const league: LeagueAttributes = await leagueRepository.createLeague(seasonId, leagueName as string);
        return league;
    },
    getLeagueByLeagueId: async(leagueId: string): Promise<LeagueAttributes> => {
        const league: LeagueAttributes | null = await leagueRepository.findLeagueByLeagueId(leagueId);
        if (!league) {
            throw errorFactory({statusCode: 404, message: `Unable to find league with league id: ${leagueId}`});
        }
        return league;
    }
};

export default leagueService;
