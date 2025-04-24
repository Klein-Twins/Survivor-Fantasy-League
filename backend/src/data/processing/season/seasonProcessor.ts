import { container } from 'tsyringe';
import { Season, SeasonStorage } from '../../../domain/season/Season';
import { SeasonsAttributes } from '../../../models/season/Seasons';
import episodeProcessor from './episode/episodeProcessor';
import survivorProcessor from './survivor/survivorProcessor';
import { SeedSeasonData } from '../../foundation/data/ssn/dataTypes';

const seasonProcessor = {
  processSeasonData,
};

function processSeasonData(seasonData: SeedSeasonData): Season {
  const seasonAttributes: SeasonsAttributes = {
    seasonId: seasonData.seasonId,
    theme: seasonData.theme,
    location: seasonData.location,
    name: seasonData.name,
    startDate: seasonData.startDate,
    endDate: seasonData.endDate,
    isActive: seasonData.isActive,
  };

  const season = new Season(seasonAttributes);

  const seasonStorage = container.resolve(SeasonStorage);
  seasonStorage.addSeason(season);

  survivorProcessor.processSeasonSurvivors(season);

  for (const [number, episode] of seasonData.episodes) {
    episodeProcessor.processEpisode(season, episode);
  }

  return season;
}

export default seasonProcessor;
