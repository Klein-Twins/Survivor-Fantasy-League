import {
  EpisodeAttributes,
  EpisodeTableAttributes,
} from '../../../models/season/Episodes';
import { SeasonsAttributes } from '../../../models/season/Seasons';
import { DomainModel } from '../../DomainModel';
import { Episode as EpisodeDTO, EpisodeType } from '../../../generated-api/';
import { EpisodeEvents } from './events/EpisodeEvents';

export type EpisodeDependencies = {
  seasonId: SeasonsAttributes['seasonId'];
  episodeEvents: EpisodeEvents;
};

export class Episode extends DomainModel<
  EpisodeTableAttributes,
  EpisodeDependencies,
  EpisodeDTO
> {
  private seasonId: EpisodeAttributes['seasonId'];
  private id: EpisodeAttributes['id'];
  private number: EpisodeAttributes['number'];
  private title: EpisodeAttributes['title'];
  private airDate: EpisodeAttributes['airDate'];
  private description: EpisodeAttributes['description'];
  private type: EpisodeAttributes['type'];
  private isTribeSwitch: EpisodeAttributes['isTribeSwitch'];
  private episodeEvents: EpisodeEvents;

  constructor({
    seasonId,
    id,
    number,
    title,
    airDate,
    description,
    type,
    isTribeSwitch = false,
  }: EpisodeTableAttributes & Omit<EpisodeDependencies, 'episodeEvents'>) {
    super();
    this.seasonId = seasonId;
    this.id = id;
    this.number = number;
    this.title = title;
    this.airDate = airDate;
    this.description = description;
    this.type = type;
    this.isTribeSwitch = isTribeSwitch;
    this.episodeEvents = new EpisodeEvents();
  }

  toDTO(): EpisodeDTO {
    throw new Error('Method not implemented.');
  }
  getAttributes(): EpisodeTableAttributes & EpisodeDependencies {
    return {
      seasonId: this.seasonId,
      id: this.id,
      number: this.number,
      title: this.title,
      airDate: this.airDate,
      description: this.description,
      type: this.type,
      isTribeSwitch: this.isTribeSwitch,
      episodeEvents: this.episodeEvents,
    };
  }
}
