import { AccountRole } from '../../../generated-api';
import { UserAttributes } from '../../../models/account/User';
import { testProfileIds, testUserIds } from '../devIds';

const testUserData: UserAttributes[] = [
  {
    userId: testUserIds.TonyStark,
    userName: 'tonystark',
    profileId: testProfileIds.TonyStark,
    email: 'tony.stark@test.com',
    userRole: AccountRole.Admin,
  },
  {
    userId: testUserIds.CaptainAmerica,
    userName: 'steverogers',
    profileId: testProfileIds.CaptainAmerica,
    email: 'steve.rogers@test.com',
    userRole: AccountRole.User,
  },
  {
    userId: testUserIds.BruceBanner,
    userName: 'brucebanner',
    profileId: testProfileIds.BruceBanner,
    email: 'bruce.banner@test.com',
    userRole: AccountRole.User,
  },
  {
    userId: testUserIds.NatashaRomanoff,
    userName: 'blackwidow',
    profileId: testProfileIds.NatashaRomanoff,
    email: 'natasha.romanoff@test.com',
    userRole: AccountRole.User,
  },
  {
    userId: testUserIds.ClintBarton,
    userName: 'hawkeye',
    profileId: testProfileIds.ClintBarton,
    email: 'clint.barton@test.com',
    userRole: AccountRole.User,
  },
  {
    userId: testUserIds.ThorOdinson,
    userName: 'thor',
    profileId: testProfileIds.ThorOdinson,
    email: 'thor.odinson@test.com',
    userRole: AccountRole.User,
  },
  {
    userId: testUserIds.WandaMaximoff,
    userName: 'scarletwitch',
    profileId: testProfileIds.WandaMaximoff,
    email: 'wanda.maximoff@test.com',
    userRole: AccountRole.User,
  },
  {
    userId: testUserIds.VisionStone,
    userName: 'vision',
    profileId: testProfileIds.VisionStone,
    email: 'vision.stone@test.com',
    userRole: AccountRole.User,
  },
  {
    userId: testUserIds.SamWilson,
    userName: 'falcon',
    profileId: testProfileIds.SamWilson,
    email: 'sam.wilson@test.com',
    userRole: AccountRole.User,
  },
  {
    userId: testUserIds.PeterParker,
    userName: 'spiderman',
    profileId: testProfileIds.PeterParker,
    email: 'peter.parker@test.com',
    userRole: AccountRole.User,
  },
  {
    userId: testUserIds.StephenStrange,
    userName: 'doctorstrange',
    profileId: testProfileIds.StephenStrange,
    email: 'stephen.strange@test.com',
    userRole: AccountRole.User,
  },
  {
    userId: testUserIds.TChallaWakanda,
    userName: 'blackpanther',
    profileId: testProfileIds.TChallaWakanda,
    email: 'tchalla.wakanda@test.com',
    userRole: AccountRole.User,
  },
];

export default testUserData;
