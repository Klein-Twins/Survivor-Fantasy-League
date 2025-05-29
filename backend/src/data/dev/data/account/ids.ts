import { UUID } from 'crypto';
import { ProfileAttributes } from '../../../../models/account/Profile';
import { UserAttributes } from '../../../../models/account/User';
import { PasswordAttributes } from '../../../../models/account/Password';
import { AccountRole } from '../../../../generated-api';

export type SeedAccount = UserAttributes &
  Omit<ProfileAttributes, 'profileId'> &
  Pick<PasswordAttributes, 'password'>;

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

export const testAccountIds: Record<
  TestProfileNames,
  { userId: UUID; profileId: UUID }
> = {
  TonyStark: {
    userId: 'a103ac43-6e48-4625-8480-51d72293f765',
    profileId: '48175a74-822b-4172-8665-355952d3bdc4',
  },
  CaptainAmerica: {
    userId: '2f4824e4-0159-43da-ab37-4af63f482418',
    profileId: '0088ed2a-ff8d-4fde-bebf-3f57ac6c0331',
  },
  BruceBanner: {
    userId: 'a4fd4566-2d92-4c6e-b6a7-3f2e436edc9c',
    profileId: 'd67e1e8a-b4db-4a64-9d38-93db0a8fe5a6',
  },
  NatashaRomanoff: {
    userId: 'c87da514-f51f-4d44-9482-d8c4d8f84db6',
    profileId: 'fb3706cd-7052-4c8b-a3f4-d3d02a60d879',
  },
  ClintBarton: {
    userId: 'fe535c77-f91e-42ec-b460-2edb2ad7d053',
    profileId: '12e8c8be-13ea-4c96-91e0-55770764c073',
  },
  ThorOdinson: {
    userId: 'f6b9b9ab-3c2b-4c88-baf0-f7d2683035b7',
    profileId: '2396d63a-5db8-4e9f-b697-d7278fe1c2f1',
  },
  WandaMaximoff: {
    userId: 'f4bbd7e7-0e56-4002-8773-c0ef0eb2e104',
    profileId: 'b2573f4b-c3ca-4fe4-9efb-38db4c2db381',
  },
  VisionStone: {
    userId: 'ae47a799-d2a6-45b4-94b9-6c2ab543e406',
    profileId: 'fbfe5f57-b82f-4b9b-8461-3e68c91b6d56',
  },
  SamWilson: {
    userId: 'd3fe8fc7-b5a3-4510-9a77-bf9ca9fd6cfd',
    profileId: 'b0d049c3-8b8f-4de6-bbb1-bab61e2e50f7',
  },
  PeterParker: {
    userId: '1c6d1701-8c38-47d0-b09d-5ffb568ddba1',
    profileId: 'a5c7c7b1-f742-4bbf-8768-7b070528ab70',
  },
  StephenStrange: {
    userId: '80fae062-35c9-4cfa-8ca9-df79fc43e687',
    profileId: 'fa9f6cfb-300f-42a1-91f2-b29f7082d438',
  },
  TChallaWakanda: {
    userId: '9b367473-492b-471e-9d4f-2e3f1e5fa274',
    profileId: 'e23223e4-6d61-4875-9750-b842b82e4933',
  },
};
