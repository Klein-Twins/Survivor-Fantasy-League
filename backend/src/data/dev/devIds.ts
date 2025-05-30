import { EpisodeSurveyAttributes } from '../../models/surveyAndPick/EpisodeSurvey';

type leagueSurveyName =
  | 'League1Season47Episode1Survey'
  | 'League1Season47Episode2Survey'
  | 'League1Season47Episode3Survey'
  | 'League1Season47Episode4Survey'
  | 'League1Season47Episode5Survey'
  | 'League1Season47Episode6Survey'
  | 'League1Season47Episode7Survey'
  | 'League1Season47Episode8Survey'
  | 'League1Season47Episode9Survey'
  | 'League1Season47Episode10Survey'
  | 'League1Season47Episode11Survey'
  | 'League1Season47Episode12Survey'
  | 'League1Season47Episode13Survey'
  | 'League1Season47Episode14Survey';

export const testLeagueSurveyIds: Record<
  leagueSurveyName,
  EpisodeSurveyAttributes['episodeSurveyId']
> = {
  League1Season47Episode1Survey: '9e7fabad-8485-488e-997b-bda4be4b5abd',
  League1Season47Episode2Survey: '300cab6a-7903-45d1-8fc5-741ea5a3374b',
  League1Season47Episode3Survey: 'ce377370-fc4a-4f29-8cb9-7cc488642d2c',
  League1Season47Episode4Survey: '594d287a-a58e-425e-94c5-b26982fc544d',
  League1Season47Episode5Survey: 'dff4b19f-5eb2-42dc-88fa-cd883b68b283',
  League1Season47Episode6Survey: 'f7e69eac-7f32-40c5-9b92-1227b0072e26',
  League1Season47Episode7Survey: 'bf2ea36b-cce1-4455-b210-6fe500344ded',
  League1Season47Episode8Survey: '3c13c668-f984-43e5-b230-923abd084fdd',
  League1Season47Episode9Survey: '02d42b54-90d5-4269-8e26-bd46640d3fb4',
  League1Season47Episode10Survey: '33e84294-d354-4f93-8037-7ea8353bc006',
  League1Season47Episode11Survey: '9bd34813-20b1-456f-b273-97564fe51e32',
  League1Season47Episode12Survey: '99a44903-4b53-4272-86e7-212cfd1aca29',
  League1Season47Episode13Survey: '2e061364-e989-4707-9fec-28806c8be20a',
  League1Season47Episode14Survey: '8f7cfd0c-ad90-4fb8-a9db-6aff4f7ab509',
};
