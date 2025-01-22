import logger from "../../config/logger";
import { Survivor } from "../../generated-api";
import survivorRepository from "../../repositories/survivorRepository";

const survivorService = {
    getSurvivorsBySeason
}

async function getSurvivorsBySeason(seasonId: number): Promise<Survivor[]> {
    return await survivorRepository.getSurvivorsBySeasonId(seasonId);
}

export default survivorService;