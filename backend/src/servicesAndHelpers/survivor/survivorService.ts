import logger from "../../config/logger";
import survivorRepository from "../../repositories/survivorRepository";
import { SurvivorDetailsOnSeasonIncludeSurvivors, SurvivorWithDetails } from "../../types/survivor/survivorTypes";

const survivorService = {

    getSurvivorsWithDetailsBySeason: async (seasonId: number): Promise<SurvivorWithDetails[]> => {

        const survivorsWithDetails : SurvivorDetailsOnSeasonIncludeSurvivors[] = await survivorRepository.getSurvivorsWithDetailsInSeason(seasonId);

        const transformedSurvivorsWithDetails : SurvivorWithDetails[] = survivorsWithDetails.map((survivor: SurvivorDetailsOnSeasonIncludeSurvivors): SurvivorWithDetails => {
            return {
                survivorId: survivor.survivorId,
                firstName: survivor.Survivor.firstName,
                lastName: survivor.Survivor.lastName,
                fromCity: survivor.Survivor.fromCity,
                fromState: survivor.Survivor.fromState,
                fromCountry: survivor.Survivor.fromCountry,
                nickName: survivor.Survivor.nickName,
                seasonId: survivor.seasonId,
                originalTribeId: survivor.originalTribeId,
                age: survivor.age,
                description: survivor.description,
                job: survivor.job,
                imageUrl: survivor.imageUrl
            }
        })

        return transformedSurvivorsWithDetails;
    },
};

export default survivorService;