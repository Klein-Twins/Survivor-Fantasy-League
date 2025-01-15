import axios from "axios";
import { SurvivorDetails } from "../../types/survivorTypes";


const API_URL = "http://localhost:3000/api"

export const getSurvivorsWithDetailsBySeasonService = async (seasonId: number): Promise<SurvivorDetails[]> => {
    const response = await axios.get(`${API_URL}/survivor?seasonId=${seasonId}&withDetails=true`);
    const survivorsWithDetailsList: SurvivorDetails[] = normalizeSurvivor(response.data);
    return survivorsWithDetailsList;
}

/**
 * Normalizes the string response data into an array of type SurvivorDetail objects
 * @param data 
 * @returns A normalized list (setting age and season id to number types for example) of SurvivorDetails
 */
const normalizeSurvivor = (data: any): SurvivorDetails[] => {
    const survivorDetailsListFromResponse: any[] = data.survivors;

    const normalizedSurvivorDetailsList = survivorDetailsListFromResponse.map((survivorDetails: any): SurvivorDetails => {
        return {
            survivorId: survivorDetails.survivorId,
            firstName: survivorDetails.firstName,
            lastName: survivorDetails.lastName,
            fromCity: survivorDetails.fromCity ?? null,
            fromState: survivorDetails.fromState,
            fromCountry: survivorDetails.fromCountry,
            nickName: survivorDetails.nickName ?? null,
            seasonId: Number(survivorDetails.seasonId),
            originalTribeId: survivorDetails.originalTribeId ?? null,
            age: Number(survivorDetails.age),
            description: survivorDetails.description,
            job: survivorDetails.job,
            imageUrl: survivorDetails.imageUrl
        }
    })
    return normalizedSurvivorDetailsList;
}