import { PasswordAttributes } from '../../models/Password';
import { ProfileAttributes } from '../../models/Profile';
import { UserAttributes } from '../../models/User';

const profiles: ProfileAttributes[] = [
  {
    profileId: '48175a74-822b-4172-8665-355952d3bdc4',
    firstName: 'Tony',
    lastName: 'Stark',
    imageUrl: null,
  },
  {
    profileId: '0088ed2a-ff8d-4fde-bebf-3f57ac6c0331',
    firstName: 'Captain',
    lastName: 'America',
    imageUrl: null,
  },
  {
    profileId: 'd67e1e8a-b4db-4a64-9d38-93db0a8fe5a6',
    firstName: 'Bruce',
    lastName: 'Banner',
    imageUrl: null,
  },
  {
    profileId: 'fb3706cd-7052-4c8b-a3f4-d3d02a60d879',
    firstName: 'Natasha',
    lastName: 'Romanoff',
    imageUrl: null,
  },
  {
    profileId: '12e8c8be-13ea-4c96-91e0-55770764c073',
    firstName: 'Clint',
    lastName: 'Barton',
    imageUrl: null,
  },
  {
    profileId: '2396d63a-5db8-4e9f-b697-d7278fe1c2f1',
    firstName: 'Thor',
    lastName: 'Odinson',
    imageUrl: null,
  },
  {
    profileId: 'b2573f4b-c3ca-4fe4-9efb-38db4c2db381',
    firstName: 'Wanda',
    lastName: 'Maximoff',
    imageUrl: null,
  },
  {
    profileId: 'fbfe5f57-b82f-4b9b-8461-3e68c91b6d56',
    firstName: 'Vision',
    lastName: 'Stone',
    imageUrl: null,
  },
  {
    profileId: 'b0d049c3-8b8f-4de6-bbb1-bab61e2e50f7',
    firstName: 'Sam',
    lastName: 'Wilson',
    imageUrl: null,
  },
  {
    profileId: 'a5c7c7b1-f742-4bbf-8768-7b070528ab70',
    firstName: 'Peter',
    lastName: 'Parker',
    imageUrl: null,
  },
  {
    profileId: 'fa9f6cfb-300f-42a1-91f2-b29f7082d438',
    firstName: 'Stephen',
    lastName: 'Strange',
    imageUrl: null,
  },
  {
    profileId: 'e23223e4-6d61-4875-9750-b842b82e4933',
    firstName: 'TChalla',
    lastName: 'Wakanda',
    imageUrl: null,
  },
];

const users: UserAttributes[] = [
  {
    userId: 'a103ac43-6e48-4625-8480-51d72293f765',
    userName: 'tonystark',
    profileId: '48175a74-822b-4172-8665-355952d3bdc4',
    email: 'tony.stark@test.com',
  },
  {
    userId: '2f4824e4-0159-43da-ab37-4af63f482418',
    userName: 'steverogers',
    profileId: '0088ed2a-ff8d-4fde-bebf-3f57ac6c0331',
    email: 'steve.rogers@test.com',
  },
  {
    userId: 'a4fd4566-2d92-4c6e-b6a7-3f2e436edc9c',
    userName: 'brucebanner',
    profileId: 'd67e1e8a-b4db-4a64-9d38-93db0a8fe5a6',
    email: 'bruce.banner@test.com',
  },
  {
    userId: 'c87da514-f51f-4d44-9482-d8c4d8f84db6',
    userName: 'blackwidow',
    profileId: 'fb3706cd-7052-4c8b-a3f4-d3d02a60d879',
    email: 'natasha.romanoff@test.com',
  },
  {
    userId: 'fe535c77-f91e-42ec-b460-2edb2ad7d053',
    userName: 'hawkeye',
    profileId: '12e8c8be-13ea-4c96-91e0-55770764c073',
    email: 'clint.barton@test.com',
  },
  {
    userId: 'f6b9b9ab-3c2b-4c88-baf0-f7d2683035b7',
    userName: 'thor',
    profileId: '2396d63a-5db8-4e9f-b697-d7278fe1c2f1',
    email: 'thor.odinson@test.com',
  },
  {
    userId: 'f4bbd7e7-0e56-4002-8773-c0ef0eb2e104',
    userName: 'scarletwitch',
    profileId: 'b2573f4b-c3ca-4fe4-9efb-38db4c2db381',
    email: 'wanda.maximoff@test.com',
  },
  {
    userId: 'ae47a799-d2a6-45b4-94b9-6c2ab543e406',
    userName: 'vision',
    profileId: 'fbfe5f57-b82f-4b9b-8461-3e68c91b6d56',
    email: 'vision.stone@test.com',
  },
  {
    userId: 'd3fe8fc7-b5a3-4510-9a77-bf9ca9fd6cfd',
    userName: 'falcon',
    profileId: 'b0d049c3-8b8f-4de6-bbb1-bab61e2e50f7',
    email: 'sam.wilson@test.com',
  },
  {
    userId: '1c6d1701-8c38-47d0-b09d-5ffb568ddba1',
    userName: 'spiderman',
    profileId: 'a5c7c7b1-f742-4bbf-8768-7b070528ab70',
    email: 'peter.parker@test.com',
  },
  {
    userId: '80fae062-35c9-4cfa-8ca9-df79fc43e687',
    userName: 'doctorstrange',
    profileId: 'fa9f6cfb-300f-42a1-91f2-b29f7082d438',
    email: 'stephen.strange@test.com',
  },
  {
    userId: '9b367473-492b-471e-9d4f-2e3f1e5fa274',
    userName: 'blackpanther',
    profileId: 'e23223e4-6d61-4875-9750-b842b82e4933',
    email: 'tchalla.wakanda@test.com',
  },
];

const passwords: PasswordAttributes[] = [
  {
    passwordSeq: 1,
    userId: 'a103ac43-6e48-4625-8480-51d72293f765',
    password: '$2b$10$zk8ke7G5h4htiPcdQ0AHoOVL2WupxtQb.4zUYyWRWfpQVSM6grXBu',
    active: true,
  },
  {
    passwordSeq: 1,
    userId: '2f4824e4-0159-43da-ab37-4af63f482418',
    password: '$2b$10$zk8ke7G5h4htiPcdQ0AHoOVL2WupxtQb.4zUYyWRWfpQVSM6grXBu',
    active: true,
  },
  {
    passwordSeq: 1,
    userId: 'a4fd4566-2d92-4c6e-b6a7-3f2e436edc9c',
    password: '$2b$10$zk8ke7G5h4htiPcdQ0AHoOVL2WupxtQb.4zUYyWRWfpQVSM6grXBu',
    active: true,
  },
  {
    passwordSeq: 1,
    userId: 'c87da514-f51f-4d44-9482-d8c4d8f84db6',
    password: '$2b$10$zk8ke7G5h4htiPcdQ0AHoOVL2WupxtQb.4zUYyWRWfpQVSM6grXBu',
    active: true,
  },
  {
    passwordSeq: 1,
    userId: 'fe535c77-f91e-42ec-b460-2edb2ad7d053',
    password: '$2b$10$zk8ke7G5h4htiPcdQ0AHoOVL2WupxtQb.4zUYyWRWfpQVSM6grXBu',
    active: true,
  },
  {
    passwordSeq: 1,
    userId: 'f6b9b9ab-3c2b-4c88-baf0-f7d2683035b7',
    password: '$2b$10$zk8ke7G5h4htiPcdQ0AHoOVL2WupxtQb.4zUYyWRWfpQVSM6grXBu',
    active: true,
  },
  {
    passwordSeq: 1,
    userId: 'f4bbd7e7-0e56-4002-8773-c0ef0eb2e104',
    password: '$2b$10$zk8ke7G5h4htiPcdQ0AHoOVL2WupxtQb.4zUYyWRWfpQVSM6grXBu',
    active: true,
  },
  {
    passwordSeq: 1,
    userId: 'ae47a799-d2a6-45b4-94b9-6c2ab543e406',
    password: '$2b$10$zk8ke7G5h4htiPcdQ0AHoOVL2WupxtQb.4zUYyWRWfpQVSM6grXBu',
    active: true,
  },
  {
    passwordSeq: 1,
    userId: 'd3fe8fc7-b5a3-4510-9a77-bf9ca9fd6cfd',
    password: '$2b$10$zk8ke7G5h4htiPcdQ0AHoOVL2WupxtQb.4zUYyWRWfpQVSM6grXBu',
    active: true,
  },
  {
    passwordSeq: 1,
    userId: '1c6d1701-8c38-47d0-b09d-5ffb568ddba1',
    password: '$2b$10$zk8ke7G5h4htiPcdQ0AHoOVL2WupxtQb.4zUYyWRWfpQVSM6grXBu',
    active: true,
  },
  {
    passwordSeq: 1,
    userId: '80fae062-35c9-4cfa-8ca9-df79fc43e687',
    password: '$2b$10$zk8ke7G5h4htiPcdQ0AHoOVL2WupxtQb.4zUYyWRWfpQVSM6grXBu',
    active: true,
  },
  {
    passwordSeq: 1,
    userId: '9b367473-492b-471e-9d4f-2e3f1e5fa274',
    password: '$2b$10$zk8ke7G5h4htiPcdQ0AHoOVL2WupxtQb.4zUYyWRWfpQVSM6grXBu',
    active: true,
  },
];

const userData = {
  profiles,
  users,
  passwords,
};

export default userData;
