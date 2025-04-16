import { AccountRole } from '../../../generated-api';
import passwordHelper from '../../../helpers/auth/passwordHelper';
import { PasswordAttributes } from '../../../models/account/Password';
import { ProfileAttributes } from '../../../models/account/Profile';
import { UserAttributes } from '../../../models/account/User';

export type Account = UserAttributes &
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

export const testProfileIds: Record<
  TestProfileNames,
  ProfileAttributes['profileId']
> = {
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

const userPassword = 'Asdf1234!';

const testAccountData: Account[] = [
  {
    userId: testUserIds.TonyStark,
    userName: 'tonystark',
    profileId: testProfileIds.TonyStark,
    email: 'tony.stark@test.com',
    userRole: AccountRole.Admin,
    firstName: 'Tony',
    lastName: 'Stark',
    password: userPassword,
  },
  {
    userId: testUserIds.CaptainAmerica,
    userName: 'captainamerica',
    profileId: testProfileIds.CaptainAmerica,
    email: 'steve.rogers@test.com',
    userRole: AccountRole.User,
    firstName: 'Steve',
    lastName: 'Rogers',
    password: userPassword,
  },
  {
    userId: testUserIds.BruceBanner,
    userName: 'brucebanner',
    profileId: testProfileIds.BruceBanner,
    email: 'bruce.banner@test.com',
    userRole: AccountRole.User,
    firstName: 'Bruce',
    lastName: 'Banner',
    password: userPassword,
  },
  {
    userId: testUserIds.NatashaRomanoff,
    userName: 'natasharomanoff',
    profileId: testProfileIds.NatashaRomanoff,
    email: 'natasha.romanoff@test.com',
    userRole: AccountRole.User,
    firstName: 'Natasha',
    lastName: 'Romanoff',
    password: userPassword,
  },
  {
    userId: testUserIds.ClintBarton,
    userName: 'clintbarton',
    profileId: testProfileIds.ClintBarton,
    email: 'clint.barton@test.com',
    userRole: AccountRole.User,
    firstName: 'Clint',
    lastName: 'Barton',
    password: userPassword,
  },
  {
    userId: testUserIds.ThorOdinson,
    userName: 'thorodinson',
    profileId: testProfileIds.ThorOdinson,
    email: 'thor.odinson@test.com',
    userRole: AccountRole.User,
    firstName: 'Thor',
    lastName: 'Odinson',
    password: userPassword,
  },
  {
    userId: testUserIds.WandaMaximoff,
    userName: 'wandamaximoff',
    profileId: testProfileIds.WandaMaximoff,
    email: 'wanda.maximoff@test.com',
    userRole: AccountRole.User,
    firstName: 'Wanda',
    lastName: 'Maximoff',
    password: userPassword,
  },
  {
    userId: testUserIds.VisionStone,
    userName: 'visionstone',
    profileId: testProfileIds.VisionStone,
    email: 'vision.stone@test.com',
    userRole: AccountRole.User,
    firstName: 'Vision',
    lastName: 'Stone',
    password: userPassword,
  },
  {
    userId: testUserIds.SamWilson,
    userName: 'samwilson',
    profileId: testProfileIds.SamWilson,
    email: 'sam.wilson@test.com',
    userRole: AccountRole.User,
    firstName: 'Sam',
    lastName: 'Wilson',
    password: userPassword,
  },
  {
    userId: testUserIds.PeterParker,
    userName: 'peterparker',
    profileId: testProfileIds.PeterParker,
    email: 'peter.parker@test.com',
    userRole: AccountRole.User,
    firstName: 'Peter',
    lastName: 'Parker',
    password: userPassword,
  },
  {
    userId: testUserIds.StephenStrange,
    userName: 'stephenstrange',
    profileId: testProfileIds.StephenStrange,
    email: 'stephen.strange@test.com',
    userRole: AccountRole.User,
    firstName: 'Stephen',
    lastName: 'Strange',
    password: userPassword,
  },
  {
    userId: testUserIds.TChallaWakanda,
    userName: 'tchalla',
    profileId: testProfileIds.TChallaWakanda,
    email: 'tchalla.wakanda@test.com',
    userRole: AccountRole.User,
    firstName: 'TChalla',
    lastName: 'Wakanda',
    password: userPassword,
  },
];

export default testAccountData;
