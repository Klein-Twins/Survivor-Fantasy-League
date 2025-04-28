import { Episode } from '../../../../domain/season/episode/Episode';
import { TribeStart } from '../../../../domain/season/episode/events/TribeStart';
import { Season } from '../../../../domain/season/Season';
import { SeasonSurvivor } from '../../../../domain/season/survivor/SeasonSurvivor';
import { Tribe } from '../../../../domain/season/tribe/Tribe';
import { EpisodeAttributes } from '../../../../models/season/Episodes';
import {
  SeedEpisode,
  SeedTribeStart,
} from '../../../foundation/data/ssn/dataTypes';

const tribeProcessor = {
  processTribeStart,
  processMergeTribeStart,
  processMergeTribesEnd,
};

function processMergeTribesEnd(nonMergeTribes: Tribe[], episode: Episode) {
  for (const tribe of nonMergeTribes) {
    tribe.end(episode);
  }
}

function processMergeTribeStart(
  season: Season,
  episodeId: EpisodeAttributes['id'],
  mergeTribeData: SeedTribeStart
): void {
  const episode = season.getEpisodeById(episodeId);
  const tribe = new Tribe({
    seasonId: season.getAttributes().seasonId,
    id: mergeTribeData.id,
    name: mergeTribeData.name,
    color: mergeTribeData.color,
    hexColor: mergeTribeData.hexColor,
    mergeTribe: episode.getAttributes().number === 1 ? false : true,
    episodeStart: episode,
    episodeEnd: null,
  });

  season.addTribe(tribe);
  episode.getEpisodeEvents().setMerge(true);
  const tribeStart = new TribeStart(tribe);
  episode.getEpisodeEvents().addTribeStart(tribeStart);
}

function processTribeStart(
  season: Season,
  episodeId: EpisodeAttributes['id'],
  tribeData: SeedTribeStart
): void {
  const episode = season.getEpisodeById(episodeId);
  const tribe = new Tribe({
    seasonId: season.getAttributes().seasonId,
    id: tribeData.id,
    name: tribeData.name,
    color: tribeData.color,
    hexColor: tribeData.hexColor,
    mergeTribe: episode.getAttributes().number === 1 ? false : true,
    episodeStart: episode,
    episodeEnd: null,
  });

  season.addTribe(tribe);

  const tribeMembersAtEpisodeStart: SeasonSurvivor[] =
    tribeData.startingSurvivors.map((survivorId) =>
      season.getSurvivorById(survivorId)
    );

  tribe
    .getTribeMemberRoster()
    .addTribeMembers(episodeId, 'episodeStart', tribeMembersAtEpisodeStart);

  const tribeStart = new TribeStart(tribe);
  season.getEpisodeById(episodeId).getEpisodeEvents().addTribeStart(tribeStart);
}

export default tribeProcessor;
