import { PickPointsAttributes } from '../../../models/surveyAndPick/picks/PickPoints';
import { PicksAttributes } from '../../../models/surveyAndPick/picks/Picks';
import { DomainModel } from '../../domainModel';
import { Pick as PickDTO } from '../../../generated-api/models/pick';
import { models } from '../../../config/db';
import { NotFoundError } from '../../../utils/errors/errors';
import { PickOptions } from './pickOptions/pickOptions';

type PickData = PicksAttributes & PickPointsAttributes;

type PickProperties = PickData & {
  pickOptions: PickOptions;
};

export class Pick
  implements
    DomainModel<PickProperties, Omit<PickDTO, 'options'>>,
    PickProperties
{
  public pickId: PickProperties['pickId'];
  public description: PickProperties['description'];
  public notes: PickProperties['notes'];
  public eventType: PickProperties['eventType'];
  public points: PickProperties['points'];
  public pickOptions: PickProperties['pickOptions'];

  constructor(pickPropertyValues: PickProperties) {
    this.pickId = pickPropertyValues.pickId;
    this.description = pickPropertyValues.description;
    this.notes = pickPropertyValues.notes;
    this.eventType = pickPropertyValues.eventType;
    this.points = pickPropertyValues.points;
    this.pickOptions = pickPropertyValues.pickOptions;
  }

  static async fetchPickById(pickId: PickProperties['pickId']) {
    const pickData = await models.Picks.findByPk(pickId);
    if (!pickData) {
      throw new NotFoundError(`Pick with ID ${pickId} not found`);
    }

    const pickPointsData = await models.PickPoints.findOne({
      where: { pickId },
    });
    if (!pickPointsData) {
      throw new NotFoundError(`PickPoints with ID ${pickId} not found`);
    }

    const pickOptions = await PickOptions.fetchPickOptions(pickId);

    const pick: PickProperties = {
      pickId: pickData.pickId,
      description: pickData.description,
      notes: pickData.notes,
      eventType: pickData.eventType,
      points: pickPointsData.points,
      pickOptions: pickOptions,
    };

    return Pick.fromAttributes(pick);
  }

  async save(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  toDTO(): Omit<PickDTO, 'options'> {
    return {
      id: this.pickId,
      description: this.description,
      pointValue: this.points,
    };
  }
  static fromAttributes(pickPropertyValues: PickProperties): Pick {
    return new Pick({
      pickId: pickPropertyValues.pickId,
      description: pickPropertyValues.description,
      notes: pickPropertyValues.notes,
      eventType: pickPropertyValues.eventType,
      points: pickPropertyValues.points,
      pickOptions: pickPropertyValues.pickOptions,
    });
  }
}
