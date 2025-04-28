import { PickOptionTypeEnum } from '../../../generated-api';
import { SeasonSurvivor } from '../../season/survivor/SeasonSurvivor';
import { Tribe } from '../../season/tribe/Tribe';

export class PickOptions {
  private pickOptionType: PickOptionTypeEnum;
  private minNumSelections: number;
  private maxNumSelections: number;
  private noneOptionAllowed: boolean;
  private options: SurvivorPickOptions | TribePickOptions;

  constructor(
    pickOptionType: PickOptionTypeEnum,
    minNumSelections: number,
    maxNumSelections: number,
    noneOptionAllowed: boolean,
    options: SurvivorPickOptions | TribePickOptions
  ) {
    this.pickOptionType = pickOptionType;
    this.minNumSelections = minNumSelections;
    this.maxNumSelections = maxNumSelections;
    this.noneOptionAllowed = noneOptionAllowed;
    this.options = options;
  }

  getPickOptionType(): PickOptionTypeEnum {
    return this.pickOptionType;
  }
  getMinNumSelections(): number {
    return this.minNumSelections;
  }
  getMaxNumSelections(): number {
    return this.maxNumSelections;
  }
  getNoneOptionAllowed(): boolean {
    return this.noneOptionAllowed;
  }
  getOptions(): SurvivorPickOptions | TribePickOptions {
    return this.options;
  }
}

class SurvivorPickOptions {
  private options: SeasonSurvivor[];
  constructor(options: SeasonSurvivor[]) {
    this.options = options;
  }
}

class TribePickOptions {
  private options: Tribe[];
  constructor(options: Tribe[]) {
    this.options = options;
  }
}
