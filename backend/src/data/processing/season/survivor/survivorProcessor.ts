import { Season } from '../../../../domain/season/Season';
import { SeasonSurvivor } from '../../../../domain/season/survivor/SeasonSurvivor';
import survivorsData from '../../../foundation/data/survivors/survivorsData';

const survivorProcessor = {
  processSeasonSurvivors,
};

async function processSeasonSurvivors(season: Season) {
  const allSurvivorsData = survivorsData;
  const seasonSurvivorsData = allSurvivorsData.filter((survivorData) =>
    survivorData.seasonDetails.has(season.getAttributes().seasonId)
  );

  for (const seasonSurvivorData of seasonSurvivorsData) {
    const survivor = new SeasonSurvivor({
      seasonId: season.getAttributes().seasonId,
      id: seasonSurvivorData.id,
      firstName: seasonSurvivorData.firstName,
      lastName: seasonSurvivorData.lastName,
      fromState: seasonSurvivorData.fromState,
      fromCity: seasonSurvivorData.fromCity,
      fromCountry: seasonSurvivorData.fromCountry,
      nickName: seasonSurvivorData.nickName,
      age: seasonSurvivorData.seasonDetails.get(
        season.getAttributes().seasonId
      )!.age,
      description: seasonSurvivorData.seasonDetails.get(
        season.getAttributes().seasonId
      )!.description,
      job: seasonSurvivorData.seasonDetails.get(
        season.getAttributes().seasonId
      )!.job,
    });
    season.addSurvivor(survivor);
  }
}

export default survivorProcessor;
