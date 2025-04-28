import { UUID } from 'crypto';
import { Pick } from './pick/pick';

export class Survey {
  protected surveyDefinitionId: UUID;
  protected picks: Pick[] = [];

  constructor(surveyDefinitionId: UUID, picks: Pick[] = []) {
    this.surveyDefinitionId = surveyDefinitionId;
    this.picks = picks;
  }

  getSurveyDefinitionId(): UUID {
    return this.surveyDefinitionId;
  }
  getPicks(): Pick[] {
    return this.picks;
  }
}
