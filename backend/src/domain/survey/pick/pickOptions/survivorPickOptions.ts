import { PickOptions as PickOptionsDTO } from '../../../../generated-api';
import { NotImplementedError } from '../../../../utils/errors/errors';
import { Episode } from '../../../season/episode/episode';
import { SeasonSurvivor } from '../../../season/survivor/seasonSurvivorBackuo';
import { Tribe } from '../../../season/tribe/tribeBackup';
import { PickOptions, PickOptionsProperties } from './pickOptions';

export type SurvivorPickOptionsProperties = Array<SeasonSurvivor> &
  PickOptionsProperties;

export class SurvivorPickOptions extends PickOptions {
  options: SeasonSurvivor[];

  constructor(pickOptionsPropertyValues: SurvivorPickOptions) {
    super(pickOptionsPropertyValues);
    this.options = pickOptionsPropertyValues.options;
  }

  static fromAttributes(
    attributes: SurvivorPickOptionsProperties
  ): SurvivorPickOptions {
    const pickOptions = super.fromAttributes(attributes);
    throw new NotImplementedError();
  }

  static getSurvivorPickOptions(
    episode: Episode,
    tribe: Tribe
  ): SurvivorPickOptions {
    // tribe.getAttributes().
    // return SurvivorPickOptions.fromAttributes(pickOptions);
    throw new NotImplementedError();
  }

  toDTO(): PickOptionsDTO {
    return {
      ...super.toDTO(),
      options: this.options.map((survivor) => survivor.toDTOBasic()),
    };
  }
}
