import {
  SeasonsAttributes,
  SeasonTableAttributes,
} from '../../models/season/Seasons';
import { Season as SeasonDTO } from '../../generated-api/';
import { DomainModel } from '../DomainModel';
import { SeasonSurvivor } from './survivor/SeasonSurvivor';
import { Episode } from './episode/Episode';
import { singleton } from 'tsyringe';
import { ConflictError, NotFoundError } from '../../utils/errors/errors';

export type SeasonDependencies = {
  survivors: SeasonSurvivor[];
  episodes: Episode[];
  tribes: any[];
};

type Tribe = any;

export class Season extends DomainModel<
  SeasonTableAttributes,
  SeasonDependencies,
  SeasonsAttributes,
  SeasonDTO
> {
  private seasonId: SeasonTableAttributes['seasonId'];
  private theme: SeasonTableAttributes['theme'];
  private location: SeasonTableAttributes['location'];
  private name: SeasonTableAttributes['name'];
  private startDate: SeasonTableAttributes['startDate'];
  private endDate: SeasonTableAttributes['endDate'];
  private isActive: SeasonTableAttributes['isActive'];
  private survivors: any[];
  private episodes: any[];
  private tribes: any[];

  constructor({
    seasonId,
    theme,
    location,
    name,
    startDate,
    endDate,
    isActive,
    survivors: survivors = [],
    episodes: episodes = [],
    tribes: tribes = [],
  }: SeasonTableAttributes & Partial<SeasonDependencies>) {
    super();
    this.seasonId = seasonId;
    this.theme = theme;
    this.location = location;
    this.name = name;
    this.startDate = startDate;
    this.endDate = endDate;
    this.isActive = isActive;
    this.survivors = survivors;
    this.episodes = episodes;
    this.tribes = tribes;
  }

  addTribe(tribe: Tribe): void {
    if (this.tribes.some((t) => t.id === tribe.id)) {
      throw new ConflictError(
        `Tribe with id ${tribe.id} already exists in season`
      );
    }
    this.tribes.push(tribe);
  }

  getTribes(): Tribe[] {
    return this.tribes;
  }

  getTribeById(id: Tribe['id']): Tribe {
    const tribe = this.tribes.find((tribe) => tribe.id === id);
    if (!tribe) {
      throw new NotFoundError(`Tribe with id ${id} not found in season`);
    }
    return tribe;
  }

  addEpisode(episode: Episode): void {
    this.episodes.push(episode);
    this.episodes.sort((a, b) => {
      if (a.number < b.number) {
        return -1;
      }
      if (a.number > b.number) {
        return 1;
      }
      return 0;
    });
  }

  getEpisodes(): Episode[] {
    return this.episodes;
  }

  getEpisodeByNumber(number: Episode['number']): Episode {
    const episode = this.episodes.find((episode) => episode.number === number);
    if (!episode) {
      throw new NotFoundError(
        `Episode with number ${number} not found in season`
      );
    }
    return episode;
  }

  getEpisodeById(id: Episode['id']): Episode {
    const episode = this.episodes.find((episode) => episode.id === id);
    if (!episode) {
      throw new NotFoundError(`Episode with id ${id} not found in season`);
    }
    return episode;
  }

  addSurvivor(survivor: SeasonSurvivor): void {
    this.survivors.push(survivor);
  }

  getSurvivors(): SeasonSurvivor[] {
    return this.survivors;
  }

  getSurvivorById(id: SeasonSurvivor['id']): SeasonSurvivor {
    const survivor = this.survivors.find((survivor) => survivor.id === id);
    if (!survivor) {
      throw new NotFoundError(`Survivor with id ${id} not found in season`);
    }
    return survivor;
  }

  getAttributes(): SeasonsAttributes {
    return {
      seasonId: this.seasonId,
      theme: this.theme,
      location: this.location,
      name: this.name,
      startDate: this.startDate,
      endDate: this.endDate,
      isActive: this.isActive,
    };
  }

  toDTO(): SeasonDTO {
    throw new Error('Method not implemented.');
  }
}

@singleton()
export class SeasonStorage {
  private seasons: Map<SeasonsAttributes['seasonId'], Season> = new Map();

  addSeason(season: Season): void {
    this.seasons.set(season.getAttributes().seasonId, season);
  }

  getSeason(seasonId: SeasonsAttributes['seasonId']): Season {
    const season = this.seasons.get(seasonId);
    if (!season) {
      throw new NotFoundError(
        `Season with id ${seasonId} not stored in SeasonStorage`
      );
    }
    return season;
  }

  clear(): void {
    this.seasons.clear();
  }
}
