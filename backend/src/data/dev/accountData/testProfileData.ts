import { ProfileAttributes } from '../../../models/account/Profile';
import { testProfileIds } from '../devIds';

const testProfileData: ProfileAttributes[] = [
  {
    profileId: testProfileIds.TonyStark,
    firstName: 'Tony',
    lastName: 'Stark',
  },
  {
    profileId: testProfileIds.CaptainAmerica,
    firstName: 'Captain',
    lastName: 'America',
  },
  {
    profileId: testProfileIds.BruceBanner,
    firstName: 'Bruce',
    lastName: 'Banner',
  },
  {
    profileId: testProfileIds.NatashaRomanoff,
    firstName: 'Natasha',
    lastName: 'Romanoff',
  },
  {
    profileId: testProfileIds.ClintBarton,
    firstName: 'Clint',
    lastName: 'Barton',
  },
  {
    profileId: testProfileIds.ThorOdinson,
    firstName: 'Thor',
    lastName: 'Odinson',
  },
  {
    profileId: testProfileIds.WandaMaximoff,
    firstName: 'Wanda',
    lastName: 'Maximoff',
  },
  {
    profileId: testProfileIds.VisionStone,
    firstName: 'Vision',
    lastName: 'Stone',
  },
  {
    profileId: testProfileIds.SamWilson,
    firstName: 'Sam',
    lastName: 'Wilson',
  },
  {
    profileId: testProfileIds.PeterParker,
    firstName: 'Peter',
    lastName: 'Parker',
  },
  {
    profileId: testProfileIds.StephenStrange,
    firstName: 'Stephen',
    lastName: 'Strange',
  },
  {
    profileId: testProfileIds.TChallaWakanda,
    firstName: 'TChalla',
    lastName: 'Wakanda',
  },
];

export default testProfileData;
