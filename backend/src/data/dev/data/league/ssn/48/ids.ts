import { LeagueAttributes } from '../../../../../../models/league/League';
import { LeagueProfileAttributes } from '../../../../../../models/league/LeagueProfile';

type testLeagueNames =
  | 'league1'
  | 'league2'
  | 'league3'
  | 'league4'
  | 'league5';

export const testLeagueIdsSeason48: Record<
  testLeagueNames,
  LeagueAttributes['leagueId']
> = {
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
  | 'League1ThorOdinson'
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

export const testLeagueProfileIds: Record<
  TestLeagueProfileNames,
  LeagueProfileAttributes['id']
> = {
  League1TonyStart: '9d8c7b6a-5e4f-3d2c-1b0a-9876543210fe',
  League1BruceBanner: 'b1c2d3e4-f5a6-7890-1234-567890abcdef',
  League1CaptainAmerica: 'a9b8c7d6-e5f4-3210-9876-543210fedcba',
  League1ThorOdinson: 'c2d3e4f5-6789-0123-4567-890123456789',
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
