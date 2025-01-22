import { INVALID_NAME_ERROR, INVALID_PROFILE_ID_ERROR, INVALID_SEASON_ID_ERROR } from "../../constants/auth/responseErrorConstants"
import { CreateLeagueRequest } from "../../types/league/leagueDto"
import errorFactory from "../../utils/errors/errorFactory"

const leagueControllerHelper = {
    validateGetLeaguesForProfileRequest,
    validateCreateLeagueRequest,
    formatCreateLeagueRequest
}


function validateGetLeaguesForProfileRequest(profileId: string | undefined): boolean {
    if (!profileId) {
        return false;
    }
    return true;
}
function validateCreateLeagueRequest(reqBody: CreateLeagueRequest): void {
    if (!reqBody.seasonId) {
        throw errorFactory(INVALID_SEASON_ID_ERROR)
    }
    if (!reqBody.name) {
        throw errorFactory(INVALID_NAME_ERROR)
    }
    if (!reqBody.profileId) {
        throw errorFactory(INVALID_PROFILE_ID_ERROR)
    }
}

function formatCreateLeagueRequest(reqBody: CreateLeagueRequest): CreateLeagueRequest {
    const seasonId: number | undefined = formatSeasonId(reqBody.seasonId);
    if (!seasonId) {
        throw errorFactory(INVALID_SEASON_ID_ERROR)
    }
    return {
        seasonId,
        name: reqBody.name,
        profileId: reqBody.profileId
    }
}

function formatSeasonId(seasonId: string | number | undefined): number | undefined {
    return seasonId ? parseInt(seasonId.toString(), 10) : undefined;
}

export default leagueControllerHelper;