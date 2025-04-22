import { TribeMembersState } from '../../../generated-api';
import { Episode } from '../episode/episode';
import { SeasonSurvivor } from '../survivor/seasonSurvivor';

export interface TribeMemberHistoryOnEpisode {
  episodeStart: Array<SeasonSurvivor>;
  tribalCouncil: Array<SeasonSurvivor>;
  episodeEnd: Array<SeasonSurvivor>;
}

export type TribeMemberHistoryMap = Map<Episode, TribeMemberHistoryOnEpisode>;

export class TribeMemberHistory {
  private history: TribeMemberHistoryMap;

  constructor() {
    this.history = new Map<Episode, TribeMemberHistoryOnEpisode>();
  }

  getFullTribeMemberHistory(): TribeMemberHistoryMap {
    return this.history;
  }

  getTribeMemberHistoryForEpisode(
    episode: Episode
  ): TribeMemberHistoryOnEpisode {
    const tribeMemberHistoryOnEpisode = this.history.get(episode);
    if (!tribeMemberHistoryOnEpisode) {
      throw new Error(
        `Tribe member history for episode ${
          episode.getAttributes().id
        } not found`
      );
    }
    return tribeMemberHistoryOnEpisode;
  }

  addTribeMemberHistoryForEpisode(
    episode: Episode,
    tribeMemberHistoryOnEpisode: TribeMemberHistoryOnEpisode
  ) {
    if (this.history.has(episode)) {
      throw new Error(
        `Tribe member history for episode ${
          episode.getAttributes().id
        } already exists`
      );
    }
    this.history.set(episode, tribeMemberHistoryOnEpisode);
  }
}
