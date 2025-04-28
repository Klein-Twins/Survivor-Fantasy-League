import { UUID } from 'crypto';
import { EventType } from '../../../models/surveyAndPick/picks/Picks';
import { PickOptions } from './PickOptions';

export class Pick {
  protected pickId: UUID;
  protected pickDescription: UUID;
  protected eventType: EventType;
  protected pickOptions: PickOptions;

  constructor(
    pickId: UUID,
    pickDescription: UUID,
    eventType: EventType,
    pickOptions: PickOptions
  ) {
    this.pickId = pickId;
    this.pickDescription = pickDescription;
    this.eventType = eventType;
    this.pickOptions = pickOptions;
  }

  getPickId(): UUID {
    return this.pickId;
  }
  getPickDescription(): UUID {
    return this.pickDescription;
  }
  getEventType(): EventType {
    return this.eventType;
  }
  getPickOptions(): PickOptions {
    return this.pickOptions;
  }
}
