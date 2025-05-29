import {
  EpisodeAttributes,
  EpisodeTableAttributes,
} from '../../../models/season/Episodes';
import { SeasonsAttributes } from '../../../models/season/Seasons';
import { DomainModel } from '../../DomainModel';
import { Episode as EpisodeDTO, EpisodeType } from '../../../generated-api';
import { EpisodeEvents } from './events/EpisodeEvents';

export type EpisodeDependencies = {
  seasonId: SeasonsAttributes['seasonId'];
  episodeEvents: EpisodeEvents;
};

export class Episode extends DomainModel<
  EpisodeTableAttributes,
  EpisodeDependencies,
  EpisodeAttributes,
  EpisodeDTO
> {
  private seasonId: EpisodeAttributes['seasonId'];
  private id: EpisodeAttributes['id'];
  private number: EpisodeAttributes['number'];
  private title: EpisodeAttributes['title'];
  private airDate: EpisodeAttributes['airDate'];
  private description: EpisodeAttributes['description'];
  private type: EpisodeAttributes['type'];
  private episodeEvents: EpisodeEvents;

  constructor({
    seasonId,
    id,
    number,
    title,
    airDate,
    description,
    type,
  }: EpisodeTableAttributes &
    Omit<EpisodeDependencies, 'episodeEvents'> & {
      episodeEvents?: EpisodeEvents;
    }) {
    super();
    this.seasonId = seasonId;
    this.id = id;
    this.number = number;
    this.title = title;
    this.airDate = airDate;
    this.description = description;
    this.type = type;
    this.episodeEvents = new EpisodeEvents(this);
  }

  toDTO(): EpisodeDTO {
    return {
      id: this.id,
      seasonId: this.seasonId,
      number: this.number,
      airDate: this.airDate.toString(),
      title: this.title,
      description: this.description,
      hasAired: new Date(this.airDate) <= new Date(),
      episodeType: this.type,
      isTribeSwitch: this.episodeEvents.getTribeSwitch(),
      tribesState: {},
    };
  }

  getEpisodeEvents(): EpisodeEvents {
    return this.episodeEvents;
  }

  getSeasonId(): Episode['seasonId'] {
    return this.seasonId;
  }

  getEpisodeId(): Episode['id'] {
    return this.id;
  }

  getAttributes(): EpisodeAttributes {
    return {
      seasonId: this.seasonId,
      id: this.id,
      number: this.number,
      title: this.title,
      airDate: this.airDate,
      description: this.description,
      type: this.type,
    };
  }
}
