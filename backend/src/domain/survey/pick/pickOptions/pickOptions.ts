import { PickOptionsAttributes } from '../../../../models/surveyAndPick/picks/PickOptions';
import { DomainModel } from '../../../domainModel';
import { PickOptions as PickOptionsDTO } from '../../../../generated-api/models/pick-options';
import { PickOptionTypeEnum } from '../../../../generated-api';
import { models } from '../../../../config/db';
import { NotFoundError } from '../../../../utils/errors/errors';

export type PickOptionsData = Omit<PickOptionsAttributes, 'pickId'>;

export type PickOptionsProperties = PickOptionsData;

export class PickOptions
  implements
    DomainModel<PickOptionsProperties, Omit<PickOptionsDTO, 'options'>>,
    PickOptionsProperties
{
  type: PickOptionTypeEnum;
  minNumSelections: PickOptionsProperties['minNumSelections'];
  maxNumSelections: PickOptionsProperties['maxNumSelections'];
  noneOptionAllowed: PickOptionsProperties['noneOptionAllowed'];

  constructor(pickOptionsPropertyValues: PickOptionsProperties) {
    this.type = pickOptionsPropertyValues.type;
    this.minNumSelections = pickOptionsPropertyValues.minNumSelections;
    this.maxNumSelections = pickOptionsPropertyValues.maxNumSelections;
    this.noneOptionAllowed = pickOptionsPropertyValues.noneOptionAllowed;
  }

  static async fetchPickOptions(id: PickOptionsAttributes['pickId']) {
    const pickOptionsData = await models.PickOptions.findOne({
      where: { pickId: id },
    });
    if (!pickOptionsData) {
      throw new NotFoundError(`PickOptions with ID ${id} not found`);
    }
    return PickOptions.fromAttributes(pickOptionsData);
  }

  async save(pickId: PickOptionsAttributes['pickId']): Promise<void> {
    await models.PickOptions.upsert({
      type: this.type,
      minNumSelections: this.minNumSelections,
      maxNumSelections: this.maxNumSelections,
      noneOptionAllowed: this.noneOptionAllowed,
      pickId,
    });
  }
  toDTO(): Omit<PickOptionsDTO, 'options'> {
    return {
      pickOptionType: this.type,
      minNumSelections: this.minNumSelections,
      maxNumSelections: this.maxNumSelections,
      noneOptionAllowed: this.noneOptionAllowed,
    };
  }
  static fromAttributes(
    pickOptionsPropertyValues: PickOptionsProperties
  ): PickOptions {
    return new PickOptions({
      type: pickOptionsPropertyValues.type,
      minNumSelections: pickOptionsPropertyValues.minNumSelections,
      maxNumSelections: pickOptionsPropertyValues.maxNumSelections,
      noneOptionAllowed: pickOptionsPropertyValues.noneOptionAllowed,
    });
  }

  getAttributes(): PickOptionsProperties {
    return {
      type: this.type,
      minNumSelections: this.minNumSelections,
      maxNumSelections: this.maxNumSelections,
      noneOptionAllowed: this.noneOptionAllowed,
    };
  }
}
