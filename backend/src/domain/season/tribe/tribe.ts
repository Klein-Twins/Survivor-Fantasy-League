import { SeasonsAttributes } from '../../../models/season/Seasons';
import {
  TribeAttributes,
  TribeTableAttributes,
} from '../../../models/season/Tribes';
import { DomainModel } from '../../DomainModel';
import { Episode } from '../episode/Episode';
import { Tribe as TribeDTO } from '../../../generated-api/index';

type TribeDependencies = {
  seasonId: SeasonsAttributes['seasonId'];
  episodeStart: Episode;
  episodeEnd: Episode | null;
};

export class Tribe extends DomainModel<
  TribeTableAttributes,
  TribeDependencies,
  TribeAttributes,
  TribeDTO
> {
  public id!: TribeTableAttributes['id'];
  public name!: TribeTableAttributes['name'];
  public color!: TribeTableAttributes['color'];
  public hexColor!: TribeTableAttributes['hexColor'];
  public mergeTribe!: TribeTableAttributes['mergeTribe'];
  public seasonId!: TribeDependencies['seasonId'];
  public episodeStart!: Episode;
  public episodeEnd!: Episode | null;

  constructor({
    seasonId,
    id,
    name,
    color,
    hexColor,
    mergeTribe,
    episodeStart,
    episodeEnd = null,
  }: TribeTableAttributes & TribeDependencies) {
    super();
    this.seasonId = seasonId;
    this.id = id;
    this.name = name;
    this.color = color;
    this.hexColor = hexColor;
    this.mergeTribe = mergeTribe;
    this.episodeStart = episodeStart;
    this.episodeEnd = episodeEnd;
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
    throw new Error('Method not implemented.');
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
}
