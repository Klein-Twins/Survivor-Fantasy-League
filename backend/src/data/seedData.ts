import { container } from 'tsyringe';
import seasonProcessor from './processing/season/seasonProcessor';
import { SeasonService } from '../services/season/SeasonService';
import sequelize from '../config/db';
import { diff } from 'deep-object-diff';
import { Season, SeasonStorage } from '../domain/season/Season';
import season48Data from './foundation/data/ssn/48/season48';
import logger from '../config/logger';
import stringifySafe from 'json-stringify-safe';
const seedData = async () => {
  const season = seasonProcessor.processSeasonData(season48Data);

  const seasonService = container.resolve(SeasonService);
  const transaction = await sequelize.transaction();

  try {
    await seasonService.saveSeason(season, transaction);
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    console.error('Error seeding data:', error);
  }
  container.resolve(SeasonStorage).clear();
  const fetchedSeason = await seasonService.fetchSeasonById(48);
  logger.debug('');
  compareSeasonWithFetchedSeason(season, fetchedSeason, 10);
};
function compareSeasonWithFetchedSeason(
  season: Season,
  fetchedSeason: Season,
  maxDepth: number
) {
  const truncatedSeason = truncateObjectWithSafeStringify(season, maxDepth);
  const truncatedFetchedSeason = truncateObjectWithSafeStringify(
    fetchedSeason,
    maxDepth
  );

  const differences = diff(truncatedSeason, truncatedFetchedSeason);

  if (Object.keys(differences).length > 0) {
    console.log('Differences found:', differences);
  } else {
    console.log('No differences found.');
  }
}
function truncateObjectWithSafeStringify(obj: any, depth: number): any {
  const jsonString = stringifySafe(obj, (key, value) => {
    // Handle Maps explicitly
    if (value instanceof Map) {
      return Array.from(value.entries()).reduce<Record<string, any>>(
        (acc, [mapKey, mapValue]) => {
          acc[String(mapKey)] = truncateValue(mapValue, depth - 1); // Convert mapKey to a string
          return acc;
        },
        {}
      );
    }

    // Limit depth by replacing nested objects beyond the specified depth
    return truncateValue(value, depth);
  });

  return JSON.parse(jsonString);
}

function truncateValue(value: any, depth: number): any {
  if (depth <= 0) {
    return '[Truncated]';
  }

  if (typeof value === 'object' && value !== null) {
    return value;
  }

  return value;
}

export default seedData;
