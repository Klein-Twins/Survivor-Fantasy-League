import logger from '../../config/logger';
import { Survivor, SurvivorBasic } from '../../generated-api';
import survivorRepository from '../../repositories/survivorRepository';

const survivorService = {
  getSurvivorsBySeason,
  getBasicSurvivorsBySeason,
};

async function getSurvivorsBySeason(seasonId: number): Promise<Survivor[]> {
  return await survivorRepository.getSurvivorsBySeasonId(seasonId);
}

async function getBasicSurvivorsBySeason(seasonId: number): Promise<SurvivorBasic[]> {
  return await survivorRepository.getBasicSurvivorsBySeason(seasonId);
}

export default survivorService;
