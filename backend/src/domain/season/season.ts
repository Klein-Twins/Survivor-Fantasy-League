import { SeasonsAttributes } from '../../models/season/Seasons';
import { Season as SeasonDTO } from '../../generated-api';
import { DomainModel } from '../domainModel';
import { SeasonSurvivor } from './survivor/seasonSurvivor';
import { Tribe } from './tribe/tribe';
import { Episode } from './episode/episode';
import { ConflictError, NotFoundError } from '../../utils/errors/errors';
import { SurvivorsAttributes } from '../../models/survivors/Survivors';
import { EpisodeAttributes } from '../../models/season/Episodes';

type SeasonDependencies = {
  survivors: SeasonSurvivor[];
  tribes: Tribe[];
  episodes: Episode[];
};

export class Season extends DomainModel<
  SeasonsAttributes,
  SeasonDependencies,
  SeasonDTO
> {
  constructor(
    attributes: SeasonsAttributes,
    dependencies?: Partial<SeasonDependencies>
  ) {
    super(attributes, dependencies);
  }

  protected getDefaultDependencies(): SeasonDependencies {
    return {
      survivors: [],
      tribes: [],
      episodes: [],
    };
  }

  // --- Instance Methods ---
  addSurvivors(survivors: SeasonSurvivor[]): void {
    survivors.forEach((survivor) => {
      const isSurvivorOnSeason = this.dependencies.survivors.some(
        (s) => s.getAttributes().id === survivor.getAttributes().id
      );
      if (isSurvivorOnSeason) {
        throw new ConflictError(
          `Survivor with ID ${
            survivor.getAttributes().id
          } is already added to this season`
        );
      }
      this.dependencies.survivors.push(survivor);
    });
  }

  addSurvivor(survivor: SeasonSurvivor): void {
    const isSurvivorOnSeason = this.dependencies.survivors.some(
      (s) => s.getAttributes().id === survivor.getAttributes().id
    );
    if (isSurvivorOnSeason) {
      throw new ConflictError(
        `Survivor with ID ${
          survivor.getAttributes().id
        } is already added to this season`
      );
    }
    this.dependencies.survivors.push(survivor);
  }

  addTribe(tribe: Tribe): void {
    const isTribeOnSeason = this.dependencies.tribes.some(
      (t) => t.getAttributes().id === tribe.getAttributes().id
    );
    if (isTribeOnSeason) {
      throw new ConflictError(
        `Tribe with ID ${
          tribe.getAttributes().id
        } is already added to this season`
      );
    }
    this.dependencies.tribes.push(tribe);
  }

  addTribes(tribes: Tribe[]): void {
    tribes.forEach((tribe) => {
      this.dependencies.tribes.push(tribe);
    });
  }

  addEpisodes(episodes: Episode[]): void {
    episodes.forEach((episode) => {
      this.addEpisode(episode);
    });
  }

  addEpisode(episode: Episode): void {
    const isEpisodeOnSeason = this.dependencies.episodes.some(
      (e) => e.getAttributes().id === episode.getAttributes().id
    );
    if (isEpisodeOnSeason) {
      throw new ConflictError(
        `Episode with ID ${
          episode.getAttributes().id
        } is already added to this season`
      );
    }
    this.dependencies.episodes.push(episode);

    this.dependencies.episodes.sort((a, b) => {
      return a.getAttributes().number - b.getAttributes().number;
    });
  }

  getSurvivors(): SeasonSurvivor[] {
    return this.dependencies.survivors;
  }

  getSurvivorById(id: SurvivorsAttributes['id']): SeasonSurvivor {
    const survivor = this.dependencies.survivors.find(
      (s) => s.getAttributes().id === id
    );
    if (!survivor) {
      throw new Error(`Survivor with ID ${id} not found`);
    }
    return survivor;
  }

  getTribes(): Tribe[] {
    return this.dependencies.tribes;
  }

  getEpisodes(): Episode[] {
    return this.dependencies.episodes;
  }

  getEpisodeById(id: EpisodeAttributes['id']): Episode {
    const episode = this.dependencies.episodes.find(
      (e) => e.getAttributes().id === id
    );
    if (!episode) {
      throw new NotFoundError(`Episode with ID ${id} not found`);
    }
    return episode;
  }

  toDTO(): SeasonDTO {
    return {
      id: this.attributes.seasonId,
      name: this.attributes.name,
      startDate: this.attributes.startDate?.toISOString() || null,
      endDate: this.attributes.endDate?.toISOString() || null,
      location: this.attributes.location,
      theme: this.attributes.theme,
      isActive: this.attributes.isActive,
      survivors: this.dependencies.survivors.map((s) => s.toDTO()),
      tribesInSeason: this.dependencies.tribes.map((t) => t.toDTO()),
      episodes: this.dependencies.episodes.map((e) => e.toDTO()),
      nextEpisode: null,
    };
  }
}
