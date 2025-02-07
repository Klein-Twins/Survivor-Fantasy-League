import { ProfileAttributes } from '../../../models/account/Profile';
import { testProfileIds } from '../devIds';

const testProfileData: ProfileAttributes[] = [
  {
    profileId: testProfileIds.TonyStark,
    firstName: 'Tony',
    lastName: 'Stark',
    imageUrl: `images/profileImages/${testProfileIds.TonyStark}.jpg`,
  },
  {
    profileId: testProfileIds.CaptainAmerica,
    firstName: 'Captain',
    lastName: 'America',
    imageUrl: `images/profileImages/${testProfileIds.CaptainAmerica}.jpg`,
  },
  {
    profileId: testProfileIds.BruceBanner,
    firstName: 'Bruce',
    lastName: 'Banner',
    imageUrl: `images/profileImages/${testProfileIds.BruceBanner}.jpg`,
  },
  {
    profileId: testProfileIds.NatashaRomanoff,
    firstName: 'Natasha',
    lastName: 'Romanoff',
    imageUrl: `images/profileImages/${testProfileIds.NatashaRomanoff}.jpg`,
  },
  {
    profileId: testProfileIds.ClintBarton,
    firstName: 'Clint',
    lastName: 'Barton',
    imageUrl: `images/profileImages/${testProfileIds.ClintBarton}.jpg`,
  },
  {
    profileId: testProfileIds.ThorOdinson,
    firstName: 'Thor',
    lastName: 'Odinson',
    imageUrl: `images/profileImages/${testProfileIds.ThorOdinson}.jpg`,
  },
  {
    profileId: testProfileIds.WandaMaximoff,
    firstName: 'Wanda',
    lastName: 'Maximoff',
    imageUrl: `images/profileImages/${testProfileIds.WandaMaximoff}.jpg`,
  },
  {
    profileId: testProfileIds.VisionStone,
    firstName: 'Vision',
    lastName: 'Stone',
    imageUrl: `images/profileImages/${testProfileIds.VisionStone}.jpg`,
  },
  {
    profileId: testProfileIds.SamWilson,
    firstName: 'Sam',
    lastName: 'Wilson',
    imageUrl: `images/profileImages/${testProfileIds.SamWilson}.jpg`,
  },
  {
    profileId: testProfileIds.PeterParker,
    firstName: 'Peter',
    lastName: 'Parker',
    imageUrl: `images/profileImages/${testProfileIds.PeterParker}.jpg`,
  },
  {
    profileId: testProfileIds.StephenStrange,
    firstName: 'Stephen',
    lastName: 'Strange',
    imageUrl: `images/profileImages/${testProfileIds.StephenStrange}.jpg`,
  },
  {
    profileId: testProfileIds.TChallaWakanda,
    firstName: 'TChalla',
    lastName: 'Wakanda',
    imageUrl: `images/profileImages/${testProfileIds.TChallaWakanda}.jpg`,
  },
];

export default testProfileData;
