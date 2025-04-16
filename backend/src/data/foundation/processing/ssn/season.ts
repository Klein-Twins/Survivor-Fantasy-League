import { models } from '../../../../config/db';
import logger from '../../../../config/logger';
import { SeasonsAttributes } from '../../../../models/season/Seasons';
import leagueProcessor from '../../../dev/processing/lge/leagueProcessor';
import season47, { Season47Tribes } from '../../data/ssn/47/season47';
import { season48, Season48Tribes } from '../../data/ssn/48/season48';
import {
  EpisodeInfo,
  SeasonData,
  StartingTribe,
  Tribes,
} from '../../data/ssn/dataTypes';
import surveyProcessor from '../sur/survey';
import episodeProcessor from './episode';
import survivorProcessor from './survivor';
import tribeProcessor from './tribe';

const seasonProcessor = {
  processSeasons,
  processSeason,
};

async function processSeasons() {
  const seasons: Array<SeasonData<Season47Tribes | Season48Tribes>> = [
    season48,
    season47,
  ];
  await processSeason(seasons[0]);
}

async function processSeason<T extends string | number | symbol>(
  seasonData: SeasonData<T>
) {
  logger.debug(`Processing season: ${seasonData.seasonId}`);
  await seedSeasonTable(seasonData);

  //Seed survivors
  await survivorProcessor.processSurvivors(seasonData.seasonId);

  await leagueProcessor.processLeagues(seasonData.seasonId);

  //seed episode infos
  const episodeInfos: EpisodeInfo[] = [];
  for (const episode of seasonData.episodes) {
    episodeInfos.push(episode[1].episodeInfo);
  }
  await episodeProcessor.processAllEpisodesInfo(
    episodeInfos,
    seasonData.seasonId
  );

  for (const episodeInfo of episodeInfos) {
    await surveyProcessor.processEpisodeSurvey(episodeInfo.id);
  }

  //Seed starting tribes
  const startingTribes: StartingTribe[] = [];
  for (const tribe of seasonData.tribes) {
    startingTribes.push(tribe[1]);
  }
  await tribeProcessor.processStartingTribes(
    startingTribes,
    seasonData.seasonId
  );

  await episodeProcessor.processAllEpisodeEvents(seasonData.episodes);
}

async function seedSeasonTable(seasonData: SeasonsAttributes) {
  logger.debug(
    `${models.Seasons.tableName}: Starting data processing for ${seasonData.seasonId}`
  );

  // Delete existing records for the season
  const numDeleted = await models.Seasons.destroy({
    where: { seasonId: seasonData.seasonId },
  });
  if (numDeleted !== 0) {
    logger.debug(
      `${models.Seasons.tableName}: Deleted ${numDeleted} records for season: ${seasonData.seasonId}`
    );
  }

  // Create a new record for the season
  logger.debug(
    `${models.Seasons.tableName}: Creating record for season: ${seasonData.seasonId}`
  );
  await models.Seasons.create({
    seasonId: seasonData.seasonId,
    theme: seasonData.theme,
    location: seasonData.location,
    name: seasonData.name,
    startDate: seasonData.startDate,
    endDate: seasonData.endDate,
    isActive: seasonData.isActive,
  });
  logger.debug(
    `${models.Seasons.tableName}: Created record for season: ${seasonData.seasonId}`
  );
}

export default seasonProcessor;
