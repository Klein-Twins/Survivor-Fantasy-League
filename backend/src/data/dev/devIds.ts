import { ProfileAttributes } from '../../models/account/Profile';
import { UserAttributes } from '../../models/account/User';
import { LeagueAttributes } from '../../models/league/League';
import { LeagueProfileAttributes } from '../../models/league/LeagueProfile';
import { LeagueSurveyAttributes } from '../../models/league/LeagueSurveys';

type TestProfileNames =
  | 'TonyStark'
  | 'CaptainAmerica'
  | 'BruceBanner'
  | 'NatashaRomanoff'
  | 'ClintBarton'
  | 'ThorOdinson'
  | 'WandaMaximoff'
  | 'VisionStone'
  | 'SamWilson'
  | 'PeterParker'
  | 'StephenStrange'
  | 'TChallaWakanda';

export const testProfileIds: Record<TestProfileNames, ProfileAttributes['profileId']> = {
  TonyStark: '48175a74-822b-4172-8665-355952d3bdc4',
  CaptainAmerica: '0088ed2a-ff8d-4fde-bebf-3f57ac6c0331',
  BruceBanner: 'd67e1e8a-b4db-4a64-9d38-93db0a8fe5a6',
  NatashaRomanoff: 'fb3706cd-7052-4c8b-a3f4-d3d02a60d879',
  ClintBarton: '12e8c8be-13ea-4c96-91e0-55770764c073',
  ThorOdinson: '2396d63a-5db8-4e9f-b697-d7278fe1c2f1',
  WandaMaximoff: 'b2573f4b-c3ca-4fe4-9efb-38db4c2db381',
  VisionStone: 'fbfe5f57-b82f-4b9b-8461-3e68c91b6d56',
  SamWilson: 'b0d049c3-8b8f-4de6-bbb1-bab61e2e50f7',
  PeterParker: 'a5c7c7b1-f742-4bbf-8768-7b070528ab70',
  StephenStrange: 'fa9f6cfb-300f-42a1-91f2-b29f7082d438',
  TChallaWakanda: 'e23223e4-6d61-4875-9750-b842b82e4933',
};

export const testUserIds: Record<TestProfileNames, UserAttributes['userId']> = {
  TonyStark: 'a103ac43-6e48-4625-8480-51d72293f765',
  CaptainAmerica: '2f4824e4-0159-43da-ab37-4af63f482418',
  BruceBanner: 'a4fd4566-2d92-4c6e-b6a7-3f2e436edc9c',
  NatashaRomanoff: 'c87da514-f51f-4d44-9482-d8c4d8f84db6',
  ClintBarton: 'fe535c77-f91e-42ec-b460-2edb2ad7d053',
  ThorOdinson: 'f6b9b9ab-3c2b-4c88-baf0-f7d2683035b7',
  WandaMaximoff: 'f4bbd7e7-0e56-4002-8773-c0ef0eb2e104',
  VisionStone: 'ae47a799-d2a6-45b4-94b9-6c2ab543e406',
  SamWilson: 'd3fe8fc7-b5a3-4510-9a77-bf9ca9fd6cfd',
  PeterParker: '1c6d1701-8c38-47d0-b09d-5ffb568ddba1',
  StephenStrange: '80fae062-35c9-4cfa-8ca9-df79fc43e687',
  TChallaWakanda: '9b367473-492b-471e-9d4f-2e3f1e5fa274',
};

type testLeagueNames = 'league1' | 'league2' | 'league3' | 'league4' | 'league5';

export const testLeagueIds: Record<testLeagueNames, LeagueAttributes['leagueId']> = {
  league1: 'c5ea9a19-c8cd-4dfc-af1b-44d3b0d4928f',
  league2: 'd4a81f95-6c27-4e85-8d43-87f93c25f071',
  league3: '7b91f1d6-87d4-4f1c-9357-fe3f19c67a2b',
  league4: 'e5c76b3a-19f2-48d7-9c4e-ba45d66f8193',
  league5: '93a4b587-cf74-4e3d-8fb6-c424f5d58d8a',
};

type TestLeagueProfileNames =
  | 'League1TonyStart'
  | 'League1BruceBanner'
  | 'League1CaptainAmerica'
  | 'League2NatashaRomanoff'
  | 'League2ClintBarton'
  | 'League2ThorOdinson'
  | 'League3WandaMaximoff'
  | 'League3VisionStone'
  | 'League3SamWilson'
  | 'League4TChallaWakanda'
  | 'League4PeterParker'
  | 'League5StephenStrange'
  | 'League5TonyStark'
  | 'League5BruceBanner';

export const testLeagueProfileIds: Record<TestLeagueProfileNames, LeagueProfileAttributes['id']> = {
  League1TonyStart: '9d8c7b6a-5e4f-3d2c-1b0a-9876543210fe',
  League1BruceBanner: 'b1c2d3e4-f5a6-7890-1234-567890abcdef',
  League1CaptainAmerica: 'a9b8c7d6-e5f4-3210-9876-543210fedcba',
  League2NatashaRomanoff: 'f1d2e3c4-b5a6-7890-1234-567890abcdef',
  League2ClintBarton: 'a2b3c4d5-e6f7-8901-2345-678901abcdef',
  League2ThorOdinson: 'b3c4d5e6-f789-0123-4567-89012abcdef3',
  League3WandaMaximoff: 'c4d5e6f7-8901-2345-6789-012345abcdef',
  League3VisionStone: 'd5e6f789-0123-4567-8901-23456abcdef7',
  League3SamWilson: 'e6f78901-2345-6789-0123-456789abcdef',
  League4TChallaWakanda: 'f789012a-3456-7890-123b-456789abcdef',
  League4PeterParker: '89012345-6789-0123-4567-89abcdef0123',
  League5StephenStrange: '90123456-7890-1234-5678-9abcdef01234',
  League5TonyStark: '01234567-8901-2345-6789-abcdef012345',
  League5BruceBanner: '12345678-9012-3456-7890-abcdef012346',
};

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

export const testLeagueSurveyIds: Record<leagueSurveyName, LeagueSurveyAttributes['leagueSurveyId']> = {
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
