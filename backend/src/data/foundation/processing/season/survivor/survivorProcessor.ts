import { container } from 'tsyringe';
import logger from '../../../../../config/logger';
import { Season } from '../../../../../domain/season/season';
import { SeasonSurvivorManager } from '../../../../../services/season/survivor/seasonSurvivorManager';
import { Season48Tribes } from '../../../data/ssn/48/season48';
import { SeasonData } from '../../../data/ssn/dataTypes';
import survivorsData from '../../../data/survivors/survivorsData';
import { SeasonSurvivor } from '../../../../../domain/season/survivor/seasonSurvivor';

const survivorProcessor = {
  processSurvivors,
};

async function processSurvivors(
  season: Season,
  seasonData: SeasonData<Season48Tribes>
): Promise<void> {
  const allSurvivorData = survivorsData;

  const survivorsOnSeasonData = allSurvivorData.filter((survivor) =>
    survivor.seasonDetails.has(seasonData.seasonId)
  );

  const seasonSurvivors: SeasonSurvivor[] = [];
  for (const survivorData of survivorsOnSeasonData) {
    logger.debug(
      `Processing survivor: ${survivorData.firstName} ${survivorData.lastName}`
    );

    const seasonSurvivor: SeasonSurvivor = new SeasonSurvivor({
      id: survivorData.id,
      firstName: survivorData.firstName,
      lastName: survivorData.lastName,
      nickName: survivorData.nickName,
      fromCity: survivorData.fromCity,
      fromState: survivorData.fromState,
      fromCountry: survivorData.fromCountry,
      seasonId: seasonData.seasonId,
      age: survivorData.seasonDetails.get(seasonData.seasonId)!.age,
      description: survivorData.seasonDetails.get(seasonData.seasonId)!
        .description,
      job: survivorData.seasonDetails.get(seasonData.seasonId)!.job,
    });

    seasonSurvivors.push(seasonSurvivor);
  }

  season.addSurvivors(seasonSurvivors);
}

export default survivorProcessor;
