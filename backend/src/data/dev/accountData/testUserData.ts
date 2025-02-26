import { AccountUserRoleEnum } from '../../../generated-api';
import { UserAttributes } from '../../../models/account/User';
import { testProfileIds, testUserIds } from '../devIds';

const testUserData: UserAttributes[] = [
  {
    userId: testUserIds.TonyStark,
    userName: 'tonystark',
    profileId: testProfileIds.TonyStark,
    email: 'tony.stark@test.com',
    userRole: AccountUserRoleEnum.ADMIN,
  },
  {
    userId: testUserIds.CaptainAmerica,
    userName: 'steverogers',
    profileId: testProfileIds.CaptainAmerica,
    email: 'steve.rogers@test.com',
    userRole: AccountUserRoleEnum.USER,
  },
  {
    userId: testUserIds.BruceBanner,
    userName: 'brucebanner',
    profileId: testProfileIds.BruceBanner,
    email: 'bruce.banner@test.com',
    userRole: AccountUserRoleEnum.USER,
  },
  {
    userId: testUserIds.NatashaRomanoff,
    userName: 'blackwidow',
    profileId: testProfileIds.NatashaRomanoff,
    email: 'natasha.romanoff@test.com',
    userRole: AccountUserRoleEnum.USER,
  },
  {
    userId: testUserIds.ClintBarton,
    userName: 'hawkeye',
    profileId: testProfileIds.ClintBarton,
    email: 'clint.barton@test.com',
    userRole: AccountUserRoleEnum.USER,
  },
  {
    userId: testUserIds.ThorOdinson,
    userName: 'thor',
    profileId: testProfileIds.ThorOdinson,
    email: 'thor.odinson@test.com',
    userRole: AccountUserRoleEnum.USER,
  },
  {
    userId: testUserIds.WandaMaximoff,
    userName: 'scarletwitch',
    profileId: testProfileIds.WandaMaximoff,
    email: 'wanda.maximoff@test.com',
    userRole: AccountUserRoleEnum.USER,
  },
  {
    userId: testUserIds.VisionStone,
    userName: 'vision',
    profileId: testProfileIds.VisionStone,
    email: 'vision.stone@test.com',
    userRole: AccountUserRoleEnum.USER,
  },
  {
    userId: testUserIds.SamWilson,
    userName: 'falcon',
    profileId: testProfileIds.SamWilson,
    email: 'sam.wilson@test.com',
    userRole: AccountUserRoleEnum.USER,
  },
  {
    userId: testUserIds.PeterParker,
    userName: 'spiderman',
    profileId: testProfileIds.PeterParker,
    email: 'peter.parker@test.com',
    userRole: AccountUserRoleEnum.USER,
  },
  {
    userId: testUserIds.StephenStrange,
    userName: 'doctorstrange',
    profileId: testProfileIds.StephenStrange,
    email: 'stephen.strange@test.com',
    userRole: AccountUserRoleEnum.USER,
  },
  {
    userId: testUserIds.TChallaWakanda,
    userName: 'blackpanther',
    profileId: testProfileIds.TChallaWakanda,
    email: 'tchalla.wakanda@test.com',
    userRole: AccountUserRoleEnum.USER,
  },
];

export default testUserData;
