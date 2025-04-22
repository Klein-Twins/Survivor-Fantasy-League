import { container } from 'tsyringe';
import { season48, Season48Tribes } from '../../data/ssn/48/season48';
import { SeasonData } from '../../data/ssn/dataTypes';
import { SeasonManager } from '../../../../services/season/seasonManager';
import { SeasonsAttributes } from '../../../../models/season/Seasons';
import sequelize from '../../../../config/db';
import { Season } from '../../../../domain/season/season';
import logger from '../../../../config/logger';
import { diff } from 'deep-object-diff';
import survivorProcessor from './survivor/survivorProcessor';
import episodeProcessor from './episode/episodeProcessor';
import tribeProcessor from './tribe/tribeProcessor';

const seasonProcessor = {
  processSeasons,
};

export default seasonProcessor;

async function processSeasons() {
  const seasons: Array<SeasonData<Season48Tribes>> = [
    season48,
    // season47,
  ];
  await processSeason(seasons[0]);
}

async function processSeason<T extends string | number | symbol>(
  seasonData: SeasonData<Season48Tribes>
): Promise<void> {
  const seasonManager = container.resolve(SeasonManager);

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

  survivorProcessor.processSurvivors(season, seasonData);

  episodeProcessor.processEpisodes(season, seasonData);

  await saveSeason(season);

  const fetchedSeason = await seasonManager.fetchSeasonById(
    seasonData.seasonId
  );

  checkForDifferences(season, fetchedSeason);
}

async function saveSeason(season: Season): Promise<void> {
  const seasonManager = container.resolve(SeasonManager);
  const transaction = await sequelize.transaction();
  try {
    await seasonManager.saveSeason(season);
    await transaction.commit();
  } catch (error) {
    logger.error('Error saving season:', error);
    await transaction.rollback();
    throw error;
  }
}

function checkForDifferences(season1: Season, season2: Season): void {
  const season2DTO = season2.toDTO();
  const season1DTO = season1.toDTO();

  const dtoDifferences = diff(season1DTO, season2DTO);
  const seasonDifferences = diff(season1, season2);

  if (Object.keys(dtoDifferences).length > 0) {
    logger.warn('DTO differences:', dtoDifferences);
  } else {
    logger.debug('No differences found in DTO');
  }
  if (Object.keys(seasonDifferences).length > 0) {
    logger.warn('Season differences:', seasonDifferences);
  } else {
    logger.debug('No differences found in Season');
  }
}
