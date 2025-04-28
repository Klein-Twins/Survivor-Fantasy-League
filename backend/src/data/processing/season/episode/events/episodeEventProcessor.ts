import logger from '../../../../../config/logger';
import { Episode } from '../../../../../domain/season/episode/Episode';
import { Season } from '../../../../../domain/season/Season';
import { EpisodeAttributes } from '../../../../../models/season/Episodes';
import {
  SeedEpisode,
  SeedTribeStartEpisodeEvent,
  SeedTribeSwitch,
} from '../../../../foundation/data/ssn/dataTypes';

import tribeProcessor from '../../tribe/tribeProcessor';
import tribeRosterProcessor from '../../tribe/tribeRosterProcessor';
import tribalCouncilProcessor from './tribalCouncilProcessor';

const episodeEventProcessor = {
  processEpisodeEvents,
};

function processEpisodeEvents(season: Season, episodeData: SeedEpisode): void {
  const episode = season.getEpisodeById(episodeData.episodeInfo.id);

  if (episodeData.episodeEvents?.merge) {
    processMergeEvent(season, episodeData);
  }
  if (episodeData.episodeEvents?.tribeStart) {
    processTribeStartEvent(
      season,
      episodeData.episodeInfo.id,
      episodeData.episodeEvents.tribeStart
    );
  } else {
    tribeRosterProcessor.populateTribeRosterAtEpisodeStart(season, episode);
  }

  if (episodeData.episodeEvents?.tribeSwitch) {
    processTribeSwitchEvent(
      season,
      episode,
      episodeData.episodeEvents.tribeSwitch
    );
  } else {
    tribeRosterProcessor.populateTribeRosterAtEpisodeTribalCouncil(
      season,
      episode
    );
  }

  if (episodeData.episodeEvents?.tribalCouncil) {
    for (const tribalCouncil of episodeData.episodeEvents.tribalCouncil) {
      tribalCouncilProcessor.processTribalCouncil(
        season,
        episodeData.episodeInfo.id,
        tribalCouncil
      );
    }
  }
  tribeRosterProcessor.populateTribeRosterAtEpisodeEnd(season, episode);
}

function processMergeEvent(season: Season, episodeData: SeedEpisode) {
  if (!episodeData.episodeEvents?.merge) {
    logger.error(
      `Episode ${episodeData.episodeInfo.id} - Merge event is missing in the episode data`
    );
    return;
  }
  tribeProcessor.processMergeTribeStart(
    season,
    episodeData.episodeInfo.id,
    episodeData.episodeEvents.merge
  );

  tribeProcessor.processMergeTribesEnd(
    season.getTribes().filter((tribe) => !tribe.getAttributes().mergeTribe),
    season.getEpisodeById(episodeData.episodeInfo.id)
  );
}

function processTribeSwitchEvent(
  season: Season,
  episode: Episode,
  tribeSwitchEvent: SeedTribeSwitch
) {
  episode.getEpisodeEvents().setTribeSwitch(true);
  tribeRosterProcessor.processTribeMemberSwitch(
    season,
    episode,
    tribeSwitchEvent
  );
  logger.info(
    `Episode ${
      episode.getAttributes().number
    } - Tribe Switch Event: ${JSON.stringify(tribeSwitchEvent)}`
  );
}

function processTribeStartEvent(
  season: Season,
  episodeId: EpisodeAttributes['id'],
  tribeStartEvent: SeedTribeStartEpisodeEvent
): void {
  for (const tribeStart of tribeStartEvent) {
    tribeProcessor.processTribeStart(season, episodeId, tribeStart);
  }
}

export default episodeEventProcessor;
