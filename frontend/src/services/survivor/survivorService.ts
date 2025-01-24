import axios, { AxiosResponse } from "axios";
import api from "../apiContainer";
import { GetSurvivorsResponse, Survivor } from "../../../generated-api";
import { ApiRequestParams } from "../../hooks/useApi";


const API_URL = "http://localhost:3000/api"

export interface GetSurvivorsBySeasonRequestParams {
    seasonId: number;
}

const survivorService = {
    getSurvivorsWithDetailsBySeasonService
}

async function getSurvivorsWithDetailsBySeasonService(requestData: ApiRequestParams<void, GetSurvivorsBySeasonRequestParams>): Promise<AxiosResponse<GetSurvivorsResponse>> {
    // const response = await axios.get(`${API_URL}/survivor?seasonId=${seasonId}&withDetails=true`);
    // const survivorsWithDetailsList: SurvivorDetails[] = normalizeSurvivor(response.data);
    // return survivorsWithDetailsList;
    const response = await api.survivorService.getSurvivors(requestData.queryParams.seasonId);
    return response;
}

export default survivorService;