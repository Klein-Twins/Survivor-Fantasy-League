import { UUID } from 'crypto';
import { DomainModel } from '../domainModel';
import { SurveyAttributes } from '../../models/surveyAndPick/Survey';

export type SurveyDefinitionProperties = Pick<
  SurveyAttributes,
  'surveyId' | 'name'
> & {
  surveyDefinitionId: UUID;
  surveyDefinitionName: string;
};

export class SurveyDefinition implements DomainModel<SurveyAttributes, void> {
  protected surveyDefinitionId: SurveyAttributes['surveyId'];
  protected surveyDefinitionName: SurveyAttributes['name'];

  constructor(surveyDefinitionPropertyValues: SurveyDefinitionProperties) {
    this.surveyDefinitionId = surveyDefinitionPropertyValues.surveyId;
    this.surveyDefinitionName = surveyDefinitionPropertyValues.name;
  }

  save(...args: any[]): Promise<void> {
    throw new Error('Method not implemented.');
  }
  toDTO(params: void): void {
    throw new Error('Method not implemented.');
  }
  fromAttributes?:
    | ((attributes: SurveyAttributes, ...args: any[]) => any)
    | undefined;
}
