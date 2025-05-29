import { SeasonsAttributes } from '../../../models/season/Seasons';
import {
  TribeAttributes,
  TribeTableAttributes,
} from '../../../models/season/Tribes';
import { DomainModel } from '../../DomainModel';
import { Tribe as TribeDTO } from '../../../generated-api/index';
import {
  TribeMemberRoster,
  TribeMemberRosterOnEpisode,
} from './TribeMemberRoster';
import { EpisodeAttributes } from '../../../models/season/Episodes';
import { Episode } from '../episode/Episode';

type TribeDependencies = {
  seasonId: SeasonsAttributes['seasonId'];
  episodeStart: Episode;
  episodeEnd: Episode | null;
  tribeMemberRoster: TribeMemberRoster;
};

export class Tribe extends DomainModel<
  TribeTableAttributes,
  TribeDependencies,
  TribeAttributes,
  TribeDTO
> {
  private id!: TribeTableAttributes['id'];
  private name!: TribeTableAttributes['name'];
  private color!: TribeTableAttributes['color'];
  private hexColor!: TribeTableAttributes['hexColor'];
  private mergeTribe!: TribeTableAttributes['mergeTribe'];
  private seasonId!: TribeDependencies['seasonId'];
  private episodeStart!: Episode;
  private episodeEnd!: Episode | null;
  private tribeMemberRoster!: TribeMemberRoster;

  constructor({
    seasonId,
    id,
    name,
    color,
    hexColor,
    mergeTribe,
    episodeStart,
    episodeEnd = null,
  }: TribeTableAttributes & Omit<TribeDependencies, 'tribeMemberRoster'>) {
    super();
    this.seasonId = seasonId;
    this.id = id;
    this.name = name;
    this.color = color;
    this.hexColor = hexColor;
    this.mergeTribe = mergeTribe;
    this.episodeStart = episodeStart;
    this.episodeEnd = episodeEnd;
    this.tribeMemberRoster = new TribeMemberRoster();
  }

  getTribeMemberRoster(): TribeMemberRoster {
    return this.tribeMemberRoster;
  }

  getTribeMemberRosterOnEpisode(
    episodeId: EpisodeAttributes['id']
  ): TribeMemberRosterOnEpisode {
    return this.tribeMemberRoster.getTribeMemberState(episodeId);
  }

  getEpisodeStart(): Episode {
    return this.episodeStart;
  }

  getEpisodeEnd(): Episode | null {
    return this.episodeEnd;
  }

  end(episode: Episode): void {
    if (this.episodeEnd) {
      throw new Error('Tribe already ended');
    }
    if (
      episode.getAttributes().number <= this.episodeStart.getAttributes().number
    ) {
      throw new Error('Episode must be after the start episode');
    }
    this.episodeEnd = episode;
  }

  toDTO(): TribeDTO {
    return {
      id: this.id,
      name: this.name,
      color: {
        name: this.color,
        hex: this.hexColor,
      },
      isMergeTribe: this.mergeTribe,
      startingSurvivors: this.tribeMemberRoster
        .getTribeMemberState(this.episodeStart.getEpisodeId())
        .episodeStart.map((s) => s.toBasicDTO()),
      episodeStarted: this.episodeStart.getEpisodeId(),
    };
  }
  getAttributes(): TribeAttributes {
    return {
      seasonId: this.seasonId,
      id: this.id,
      name: this.name,
      color: this.color,
      hexColor: this.hexColor,
      mergeTribe: this.mergeTribe,
      episodeIdStart: this.episodeStart.getAttributes().id,
      episodeIdEnd: this.episodeEnd?.getAttributes().id || null,
    };
  }

  getTribeId(): Tribe['id'] {
    return this.id;
  }
}
