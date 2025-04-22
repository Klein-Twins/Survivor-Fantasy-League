import { container } from 'tsyringe';
import logger from '../../../../../config/logger';
import { Season } from '../../../../../domain/season/season';
import {
  Episode as EpisodeType,
  SurvivorEliminationEvent,
  TribeStartEvent,
} from '../../../data/ssn/dataTypes';
import { SurvivorEliminationEventService } from '../../../../../services/season/episode/events/survivorEliminationEventService';
import tribeProcessor from '../tribe/tribeProcessor';
import { TribeManager } from '../../../../../services/season/tribe/tribeManager';

const episodeEventProcessor = {
  processEpisodeEvents,
};

function processEpisodeEvents(season: Season, episode: EpisodeType) {
  logger.debug(`Processing episode events`);

  const episodeEvents = episode.episodeEvents;

  if (episodeEvents?.tribeStart) {
    processTribeStartEvent(season, episode, episodeEvents.tribeStart);
  }

  if (episodeEvents?.survivorEliminationEvent) {
    processEliminationEvent(
      season,
      episode,
      episodeEvents.survivorEliminationEvent
    );
  }
}

function processTribeStartEvent(
  season: Season,
  episodeData: EpisodeType,
  tribeStartEvent: TribeStartEvent
) {
  logger.debug(`Processing tribe start event`);

  for (const tribeData of tribeStartEvent) {
    const episode = season.getEpisodeById(episodeData.episodeInfo.id);
    const tribeService = container.resolve(TribeManager);
    const tribe = tribeService.processTribeStart(season, episode, tribeData);
  }

  logger.debug(`Finished processing tribe start event`);
}

function processEliminationEvent(
  season: Season,
  episode: EpisodeType,
  survivorEliminationEvent: SurvivorEliminationEvent
) {
  const survivorEliminationEventService = container.resolve(
    SurvivorEliminationEventService
  );

  logger.debug(`Processing elimination event`);

  survivorEliminationEventService.processSurvivorEliminationEvent(
    season,
    episode.episodeInfo.id,
    survivorEliminationEvent
  );

  logger.debug(`Finished processing elimination event`);
}

export default episodeEventProcessor;
