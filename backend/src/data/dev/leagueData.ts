import { LeagueMemberRoleEnum } from '../../generated-api';
import { LeagueAttributes } from '../../models/league/League';
import { InviteStatusEnum, LeagueProfileAttributes } from '../../models/league/LeagueProfile';

const leagues: LeagueAttributes[] = [
  {
    leagueId: 'c5ea9a19-c8cd-4dfc-af1b-44d3b0d4928f',
    seasonId: 47,
    name: 'The Chicken Race on the island',
    createdAt: new Date('2025-01-15T16:16:28.942-06:00'),
  },
  {
    leagueId: 'd4a81f95-6c27-4e85-8d43-87f93c25f071',
    seasonId: 47,
    name: 'Avengers Assemble Fantasy League',
    createdAt: new Date('2025-01-15T16:16:28.942-06:00'),
  },
  {
    leagueId: '7b91f1d6-87d4-4f1c-9357-fe3f19c67a2b',
    seasonId: 47,
    name: 'Shield Agents League',
    createdAt: new Date('2025-01-15T16:16:28.942-06:00'),
  },
  {
    leagueId: 'e5c76b3a-19f2-48d7-9c4e-ba45d66f8193',
    seasonId: 47,
    name: 'Wakanda Forever League',
    createdAt: new Date('2025-01-15T16:16:28.942-06:00'),
  },
  {
    leagueId: '93a4b587-cf74-4e3d-8fb6-c424f5d58d8a',
    seasonId: 47,
    name: 'Guardians of the Galaxy League',
    createdAt: new Date('2025-01-15T16:16:28.942-06:00'),
  },
];

const leagueProfiles: LeagueProfileAttributes[] = [
  // The Chicken Race League
  {
    id: '9d8c7b6a-5e4f-3d2c-1b0a-9876543210fe',
    profileId: '48175a74-822b-4172-8665-355952d3bdc4',
    leagueId: 'c5ea9a19-c8cd-4dfc-af1b-44d3b0d4928f',
    role: LeagueMemberRoleEnum.OWNER,
    inviteStatus: InviteStatusEnum.Accepted,
    inviterProfileId: null,
  },
  {
    id: 'b1c2d3e4-f5a6-7890-1234-567890abcdef',
    profileId: 'd67e1e8a-b4db-4a64-9d38-93db0a8fe5a6',
    leagueId: 'c5ea9a19-c8cd-4dfc-af1b-44d3b0d4928f',
    role: LeagueMemberRoleEnum.MEMBER,
    inviteStatus: InviteStatusEnum.Accepted,
    inviterProfileId: '48175a74-822b-4172-8665-355952d3bdc4',
  },
  {
    id: 'a9b8c7d6-e5f4-3210-9876-543210fedcba',
    profileId: '0088ed2a-ff8d-4fde-bebf-3f57ac6c0331',
    leagueId: 'c5ea9a19-c8cd-4dfc-af1b-44d3b0d4928f',
    role: LeagueMemberRoleEnum.MEMBER,
    inviteStatus: InviteStatusEnum.Pending,
    inviterProfileId: '48175a74-822b-4172-8665-355952d3bdc4',
  },

  // Avengers Assemble League
  {
    id: 'f1d2e3c4-b5a6-7890-1234-567890abcdef',
    profileId: 'fb3706cd-7052-4c8b-a3f4-d3d02a60d879',
    leagueId: 'd4a81f95-6c27-4e85-8d43-87f93c25f071',
    role: LeagueMemberRoleEnum.OWNER,
    inviteStatus: InviteStatusEnum.Accepted,
    inviterProfileId: null,
  },
  {
    id: 'a2b3c4d5-e6f7-8901-2345-678901abcdef',
    profileId: '12e8c8be-13ea-4c96-91e0-55770764c073',
    leagueId: 'd4a81f95-6c27-4e85-8d43-87f93c25f071',
    role: LeagueMemberRoleEnum.MEMBER,
    inviteStatus: InviteStatusEnum.Accepted,
    inviterProfileId: 'fb3706cd-7052-4c8b-a3f4-d3d02a60d879',
  },
  {
    id: 'b3c4d5e6-f789-0123-4567-89012abcdef3',
    profileId: '2396d63a-5db8-4e9f-b697-d7278fe1c2f1',
    leagueId: 'd4a81f95-6c27-4e85-8d43-87f93c25f071',
    role: LeagueMemberRoleEnum.MEMBER,
    inviteStatus: InviteStatusEnum.Pending,
    inviterProfileId: 'fb3706cd-7052-4c8b-a3f4-d3d02a60d879',
  },

  // Shield Agents League
  {
    id: 'c4d5e6f7-8901-2345-6789-012345abcdef',
    profileId: 'b2573f4b-c3ca-4fe4-9efb-38db4c2db381',
    leagueId: '7b91f1d6-87d4-4f1c-9357-fe3f19c67a2b',
    role: LeagueMemberRoleEnum.OWNER,
    inviteStatus: InviteStatusEnum.Accepted,
    inviterProfileId: null,
  },
  {
    id: 'd5e6f789-0123-4567-8901-23456abcdef7',
    profileId: 'fbfe5f57-b82f-4b9b-8461-3e68c91b6d56',
    leagueId: '7b91f1d6-87d4-4f1c-9357-fe3f19c67a2b',
    role: LeagueMemberRoleEnum.MEMBER,
    inviteStatus: InviteStatusEnum.Accepted,
    inviterProfileId: 'b2573f4b-c3ca-4fe4-9efb-38db4c2db381',
  },
  {
    id: 'e6f78901-2345-6789-0123-456789abcdef',
    profileId: 'b0d049c3-8b8f-4de6-bbb1-bab61e2e50f7',
    leagueId: '7b91f1d6-87d4-4f1c-9357-fe3f19c67a2b',
    role: LeagueMemberRoleEnum.MEMBER,
    inviteStatus: InviteStatusEnum.Pending,
    inviterProfileId: 'b2573f4b-c3ca-4fe4-9efb-38db4c2db381',
  },

  // Wakanda Forever League
  {
    id: 'f789012a-3456-7890-123b-456789abcdef',
    profileId: 'e23223e4-6d61-4875-9750-b842b82e4933',
    leagueId: 'e5c76b3a-19f2-48d7-9c4e-ba45d66f8193',
    role: LeagueMemberRoleEnum.OWNER,
    inviteStatus: InviteStatusEnum.Accepted,
    inviterProfileId: null,
  },
  {
    id: '89012345-6789-0123-4567-89abcdef0123',
    profileId: 'a5c7c7b1-f742-4bbf-8768-7b070528ab70',
    leagueId: 'e5c76b3a-19f2-48d7-9c4e-ba45d66f8193',
    role: LeagueMemberRoleEnum.MEMBER,
    inviteStatus: InviteStatusEnum.Accepted,
    inviterProfileId: 'e23223e4-6d61-4875-9750-b842b82e4933',
  },

  // Guardians League
  {
    id: '90123456-7890-1234-5678-9abcdef01234',
    profileId: 'fa9f6cfb-300f-42a1-91f2-b29f7082d438',
    leagueId: '93a4b587-cf74-4e3d-8fb6-c424f5d58d8a',
    role: LeagueMemberRoleEnum.OWNER,
    inviteStatus: InviteStatusEnum.Accepted,
    inviterProfileId: null,
  },
  {
    id: '01234567-8901-2345-6789-abcdef012345',
    profileId: '48175a74-822b-4172-8665-355952d3bdc4',
    leagueId: '93a4b587-cf74-4e3d-8fb6-c424f5d58d8a',
    role: LeagueMemberRoleEnum.MEMBER,
    inviteStatus: InviteStatusEnum.Accepted,
    inviterProfileId: 'fa9f6cfb-300f-42a1-91f2-b29f7082d438',
  },
  {
    id: '12345678-9012-3456-7890-abcdef012346',
    profileId: 'd67e1e8a-b4db-4a64-9d38-93db0a8fe5a6',
    leagueId: '93a4b587-cf74-4e3d-8fb6-c424f5d58d8a',
    role: LeagueMemberRoleEnum.MEMBER,
    inviteStatus: InviteStatusEnum.Pending,
    inviterProfileId: 'fa9f6cfb-300f-42a1-91f2-b29f7082d438',
  },
];

const LeagueData = {
  leagues,
  leagueProfiles,
};

export default LeagueData;
