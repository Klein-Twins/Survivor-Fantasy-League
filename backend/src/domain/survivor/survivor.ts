import { SurvivorsAttributes } from '../../models/survivors/Survivors';
import { SurvivorBasic as SurvivorBasicDTO } from '../../generated-api';
import { DomainModel } from '../domainModel';

type SurvivorDependencies = {};

export class Survivor extends DomainModel<
  SurvivorsAttributes,
  SurvivorDependencies,
  SurvivorBasicDTO
> {
  constructor(
    attributes: SurvivorsAttributes,
    dependencies?: Partial<SurvivorDependencies>
  ) {
    super(attributes, dependencies);
  }

  getName(): string {
    return this.attributes.firstName + ' ' + this.attributes.lastName;
  }

  toDTO(): SurvivorBasicDTO {
    return {
      id: this.attributes.id,
      firstName: this.attributes.firstName,
      lastName: this.attributes.lastName,
      name: this.attributes.firstName + ' ' + this.attributes.lastName,
    };
  }
  protected getDefaultDependencies(): SurvivorDependencies {
    return {};
  }
}
