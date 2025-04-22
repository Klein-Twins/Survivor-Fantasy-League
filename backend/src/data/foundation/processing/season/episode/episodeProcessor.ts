import logger from '../../../../../config/logger';
import { Episode } from '../../../../../domain/season/episode/episode';
import { Season } from '../../../../../domain/season/season';
import { EpisodeAttributes } from '../../../../../models/season/Episodes';
import { Season48Tribes } from '../../../data/ssn/48/season48';
import {
  Episode as EpisodeType,
  SeasonData,
} from '../../../data/ssn/dataTypes';
import episodeEventProcessor from './episodeEventProcessor';

const episodeProcessor = {
  processEpisodes,
  processEpisode,
};

function processEpisodes<T extends string | number | symbol>(
  season: Season,
  seasonData: SeasonData<Season48Tribes>
): void {
  const episodes = seasonData.episodes;
  logger.debug(
    `Processing ${episodes.size} episodes for season: ${seasonData.seasonId}`
  );
  for (const [episodeNumber, episode] of episodes) {
    logger.debug(
      `Processing episode: ${episodeNumber} - ${episode.episodeInfo.title}`
    );
    processEpisode(season, episode);
    logger.debug(
      `Processed episode: ${episodeNumber} - ${episode.episodeInfo.title}`
    );
  }
  logger.debug(
    `Finished processing episodes ${episodes.size} for season: ${seasonData.seasonId}`
  );
}

function processEpisode(season: Season, episode: EpisodeType): void {
  const episodeAttributes: EpisodeAttributes = {
    id: episode.episodeInfo.id,
    seasonId: season.getAttributes().seasonId,
    number: episode.episodeInfo.number,
    airDate: episode.episodeInfo.airDate,
    title: episode.episodeInfo.title,
    description: episode.episodeInfo.description,
    type: episode.episodeInfo.type,
  };

  const newEpisode = new Episode(episodeAttributes);
  season.addEpisode(newEpisode);

  episodeEventProcessor.processEpisodeEvents(season, episode);
}

export default episodeProcessor;
