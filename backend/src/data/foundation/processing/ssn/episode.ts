import { models } from '../../../../config/db';
import logger from '../../../../config/logger';
import { SeasonsAttributes } from '../../../../models/season/Seasons';
import { EpisodeInfo, Episodes, Episode } from '../../data/ssn/dataTypes';
import challengeProcessor from './challenge';
import survivorProcessor from './survivor';

const episodeProcessor = {
  processAllEpisodesInfo,
  processAllEpisodeEvents,
};

async function processAllEpisodeEvents(episodes: Episodes) {
  logger.debug(`Processing all episode events`);

  for (const episode of episodes) {
    await processEpisodeEvents(episode[1]);
  }

  logger.debug(`Processed all episode events`);
}

async function processEpisodeEvents(episode: Episode) {
  const episodeAttributes = await models.Episode.findByPk(
    episode.episodeInfo.id
  );
  if (!episodeAttributes) {
    throw new Error(
      `Episode with ID ${episode.episodeInfo.id} not found in the database`
    );
  }

  logger.debug(
    `Processing episode events for episode: ${episode.episodeInfo.number} in season: ${episodeAttributes.seasonId}`
  );

  if (episode.episodeEvents?.tribeSwitch) {
    //await tribeProcessor.processTribeSwitch
  }
  if (episode.episodeEvents?.isMerge) {
    //await tribeProcessor.processTribeMerge
  }
  if (episode.episodeEvents?.eliminatedSurvivors) {
    await survivorProcessor.processEliminatedSurvivors(
      episode.episodeEvents.eliminatedSurvivors,
      episode.episodeInfo.id
    );
  }
  if (episode.episodeEvents?.challenges) {
    await challengeProcessor.processChallenges(episode);
  }

  logger.debug(
    `Processed episode events for episode: ${episode.episodeInfo.number} in season: ${episodeAttributes.seasonId}`
  );
}

async function processAllEpisodesInfo(
  episodes: EpisodeInfo[],
  seasonId: SeasonsAttributes['seasonId']
) {
  logger.debug(`Processing all episodes info for season: ${seasonId}`);

  for (const episode of episodes) {
    await processEpisodeInfo(episode, seasonId);
  }

  logger.debug(
    `Processing ${episodes.length} episodes for season: ${seasonId}`
  );
}

async function processEpisodeInfo(
  episode: EpisodeInfo,
  seasonId: SeasonsAttributes['seasonId']
) {
  logger.debug(
    `Processing episode info for episode: ${episode.number} of season: ${seasonId}`
  );

  await seedEpisodeTable(episode, seasonId);

  logger.debug(
    `Processed episode info for episode: ${episode.number} of season: ${seasonId}`
  );
}

async function seedEpisodeTable(
  episode: EpisodeInfo,
  seasonId: SeasonsAttributes['seasonId']
) {
  logger.debug(
    `${models.Episode.tableName}: Starting data processing for episode: ${episode.number}`
  );

  const episodeInDatabase = await models.Episode.findOne({
    where: { seasonId, number: episode.number },
  });

  const numDeleted = await models.Episode.destroy({
    where: { seasonId, number: episode.number },
  });

  if (numDeleted !== 0) {
    logger.debug(
      `${models.Episode.tableName}: Deleted ${numDeleted} records for episode: ${episode.number}`
    );
  }

  logger.debug(
    `${models.Episode.tableName}: Creating record for episode: ${episode.number}`
  );
  await models.Episode.create({
    id: episode.id,
    seasonId: seasonId,
    number: episode.number,
    title: episode.title,
    airDate: episode.airDate,
    description: episode.description,
    type: episode.type,
  });

  logger.debug(
    `${models.Episode.tableName}: Created record for episode: ${episode.number}`
  );
}
export default episodeProcessor;
