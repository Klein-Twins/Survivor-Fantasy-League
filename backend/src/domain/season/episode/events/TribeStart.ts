import { Tribe } from '../../tribe/Tribe';

export class TribeStart {
  private tribe: Tribe;

  constructor(tribe: Tribe) {
    this.tribe = tribe;
  }

  getTribe(): Tribe {
    return this.tribe;
  }
}
