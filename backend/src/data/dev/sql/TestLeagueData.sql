-- INSERT INTO "LGE_LEAGUE" ("LEAGUE_ID", "SEASON_ID", "NAME", "createdAt", "updatedAt")
-- VALUES ('c5ea9a19-c8cd-4dfc-af1b-44d3b0d4928f', 47, 'The Chicken Race on the island', '2025-01-15 16:16:28.942-06', '2025-01-15 16:16:28.942-06');


-- --Dev for LGE_LEAGUES_PROFILES
-- --Includes an OWNER, a pending invite and an accepted invite for Tony Stark, Bruce Banner and Captan America respectively
-- INSERT INTO "LGE_LEAGUES_PROFILES" ("ID", "PROFILE_ID", "LEAGUE_ID", "ROLE", "INVITE_STATUS", "CREATED_AT", "UPDATED_AT")
-- VALUES ('9d8c7b6a-5e4f-3d2c-1b0a-9876543210fe', '48175a74-822b-4172-8665-355952d3bdc4', 'c5ea9a19-c8cd-4dfc-af1b-44d3b0d4928f', 'OWNER', 'accepted', '2025-01-15 16:16:28.946-06', '2025-01-15 16:16:28.946-06');

-- INSERT INTO "LGE_LEAGUES_PROFILES" ("ID", "PROFILE_ID", "LEAGUE_ID", "ROLE", "INVITER_PROFILE_ID" ,"INVITE_STATUS", "CREATED_AT", "UPDATED_AT")
-- VALUES ('b1c2d3e4-f5a6-7890-1234-567890abcdef','d67e1e8a-b4db-4a64-9d38-93db0a8fe5a6', 'c5ea9a19-c8cd-4dfc-af1b-44d3b0d4928f', 'MEMBER', '48175a74-822b-4172-8665-355952d3bdc4', 'accepted', '2025-01-15 16:16:28.946-06', '2025-01-15 16:16:28.946-06');

-- INSERT INTO "LGE_LEAGUES_PROFILES" ("ID", "PROFILE_ID", "LEAGUE_ID", "ROLE", "INVITER_PROFILE_ID", "INVITE_STATUS", "CREATED_AT", "UPDATED_AT")
-- VALUES ('a9b8c7d6-e5f4-3210-9876-543210fedcba' ,'0088ed2a-ff8d-4fde-bebf-3f57ac6c0331', 'c5ea9a19-c8cd-4dfc-af1b-44d3b0d4928f', 'MEMBER', '48175a74-822b-4172-8665-355952d3bdc4', 'pending', '2025-01-15 16:16:28.946-06', '2025-01-15 16:16:28.946-06');


-- New Leagues
INSERT INTO "LGE_LEAGUE" ("LEAGUE_ID", "SEASON_ID", "NAME", "createdAt", "updatedAt") VALUES
('d4a81f95-6c27-4e85-8d43-87f93c25f071', 47, 'Avengers Assemble Fantasy League', '2025-01-15 16:16:28.942-06', '2025-01-15 16:16:28.942-06'),
('7b91f1d6-87d4-4f1c-9357-fe3f19c67a2b', 47, 'Shield Agents League', '2025-01-15 16:16:28.942-06', '2025-01-15 16:16:28.942-06'),
('e5c76b3a-19f2-48d7-9c4e-ba45d66f8193', 47, 'Wakanda Forever League', '2025-01-15 16:16:28.942-06', '2025-01-15 16:16:28.942-06'),
('93a4b587-cf74-4e3d-8fb6-c424f5d58d8a', 47, 'Guardians of the Galaxy League', '2025-01-15 16:16:28.942-06', '2025-01-15 16:16:28.942-06');

-- League 1: Avengers Assemble Fantasy League
INSERT INTO "LGE_LEAGUES_PROFILES" ("ID", "PROFILE_ID", "LEAGUE_ID", "ROLE", "INVITE_STATUS", "INVITER_PROFILE_ID", "CREATED_AT", "UPDATED_AT") VALUES
('f1d2e3c4-b5a6-7890-1234-567890abcdef', 'fb3706cd-7052-4c8b-a3f4-d3d02a60d879', 'd4a81f95-6c27-4e85-8d43-87f93c25f071', 'OWNER', 'accepted', null, '2025-01-15 16:16:28.946-06', '2025-01-15 16:16:28.946-06'),
('a2b3c4d5-e6f7-8901-2345-678901abcdef', '12e8c8be-13ea-4c96-91e0-55770764c073', 'd4a81f95-6c27-4e85-8d43-87f93c25f071', 'MEMBER', 'accepted', 'fb3706cd-7052-4c8b-a3f4-d3d02a60d879', '2025-01-15 16:16:28.946-06', '2025-01-15 16:16:28.946-06'),
('b3c4d5e6-f789-0123-4567-89012abcdef3', '2396d63a-5db8-4e9f-b697-d7278fe1c2f1', 'd4a81f95-6c27-4e85-8d43-87f93c25f071', 'MEMBER', 'pending', 'fb3706cd-7052-4c8b-a3f4-d3d02a60d879', '2025-01-15 16:16:28.946-06', '2025-01-15 16:16:28.946-06');

-- League 2: Shield Agents League
INSERT INTO "LGE_LEAGUES_PROFILES" ("ID", "PROFILE_ID", "LEAGUE_ID", "ROLE", "INVITE_STATUS", "INVITER_PROFILE_ID", "CREATED_AT", "UPDATED_AT") VALUES
('c4d5e6f7-8901-2345-6789-012345abcdef', 'b2573f4b-c3ca-4fe4-9efb-38db4c2db381', '7b91f1d6-87d4-4f1c-9357-fe3f19c67a2b', 'OWNER', 'accepted', null, '2025-01-15 16:16:28.946-06', '2025-01-15 16:16:28.946-06'),
('d5e6f789-0123-4567-8901-23456abcdef7', 'fbfe5f57-b82f-4b9b-8461-3e68c91b6d56', '7b91f1d6-87d4-4f1c-9357-fe3f19c67a2b', 'MEMBER', 'accepted', 'b2573f4b-c3ca-4fe4-9efb-38db4c2db381', '2025-01-15 16:16:28.946-06', '2025-01-15 16:16:28.946-06'),
('e6f78901-2345-6789-0123-456789abcdef', 'b0d049c3-8b8f-4de6-bbb1-bab61e2e50f7', '7b91f1d6-87d4-4f1c-9357-fe3f19c67a2b', 'MEMBER', 'pending', 'b2573f4b-c3ca-4fe4-9efb-38db4c2db381', '2025-01-15 16:16:28.946-06', '2025-01-15 16:16:28.946-06');

-- League 3: Wakanda Forever League
INSERT INTO "LGE_LEAGUES_PROFILES" ("ID", "PROFILE_ID", "LEAGUE_ID", "ROLE", "INVITE_STATUS", "INVITER_PROFILE_ID", "CREATED_AT", "UPDATED_AT") VALUES
('f789012a-3456-7890-123b-456789abcdef', 'e23223e4-6d61-4875-9750-b842b82e4933', 'e5c76b3a-19f2-48d7-9c4e-ba45d66f8193', 'OWNER', 'accepted', null, '2025-01-15 16:16:28.946-06', '2025-01-15 16:16:28.946-06'),
('89012345-6789-0123-4567-89abcdef0123', 'a5c7c7b1-f742-4bbf-8768-7b070528ab70', 'e5c76b3a-19f2-48d7-9c4e-ba45d66f8193', 'MEMBER', 'accepted', 'e23223e4-6d61-4875-9750-b842b82e4933', '2025-01-15 16:16:28.946-06', '2025-01-15 16:16:28.946-06');

-- League 4: Guardians of the Galaxy League
INSERT INTO "LGE_LEAGUES_PROFILES" ("ID", "PROFILE_ID", "LEAGUE_ID", "ROLE", "INVITE_STATUS", "INVITER_PROFILE_ID", "CREATED_AT", "UPDATED_AT") VALUES
('90123456-7890-1234-5678-9abcdef01234', 'fa9f6cfb-300f-42a1-91f2-b29f7082d438', '93a4b587-cf74-4e3d-8fb6-c424f5d58d8a', 'OWNER', 'accepted', null, '2025-01-15 16:16:28.946-06', '2025-01-15 16:16:28.946-06'),
('01234567-8901-2345-6789-abcdef012345', '48175a74-822b-4172-8665-355952d3bdc4', '93a4b587-cf74-4e3d-8fb6-c424f5d58d8a', 'MEMBER', 'accepted', 'fa9f6cfb-300f-42a1-91f2-b29f7082d438', '2025-01-15 16:16:28.946-06', '2025-01-15 16:16:28.946-06'),
('12345678-9012-3456-7890-abcdef012346', 'd67e1e8a-b4db-4a64-9d38-93db0a8fe5a6', '93a4b587-cf74-4e3d-8fb6-c424f5d58d8a', 'MEMBER', 'pending', 'fa9f6cfb-300f-42a1-91f2-b29f7082d438', '2025-01-15 16:16:28.946-06', '2025-01-15 16:16:28.946-06');


INSERT INTO "PCK_PICK_OPTIONS" ("PICK_OPTION_TYPE", "CHOICE", "createdAt", "updatedAt") VALUES
('color','red', NOW(), NOW()),
('color','blue', NOW(), NOW()),
('color','green', NOW(), NOW()),
('color','yellow', NOW(), NOW()),
('color','orange', NOW(), NOW()),
('color','black', NOW(), NOW()),
('color','blue', NOW(), NOW());



INSERT INTO "PCK_PICKS" ("PICK_ID", "SURVEY_TYPE", "DESCRIPTION", "IS_CUSTOM", "TYPE", "createdAt", "updatedAt") VALUES
('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Premier', 'Which Tribe will go to tribal council?', false, 'survivor', NOW(), NOW()),
('38c3f7bc-e2c4-4c9d-b4a8-f1c2d3e4f5a6', 'Premier', 'Which tribe will have the sole survivor?', false, 'tribe', NOW(), NOW()),
('b9d1c2e3-f4a5-4b7c-8d9e-0f1a2b3c4d5e', 'Weekly', 'Who will be eliminated in the next episode?', false, 'survivor', NOW(), NOW()),
('7a8b9c0d-1e2f-4372-a567-0e02b2c3d479', 'Weekly', 'The color of the underwear for the first naked survivor', false, 'color', NOW(), NOW()),
('c5d6e7f8-9a0b-4c9d-b4a8-f1c2d3e4f5a6', 'Weekly', 'Who will win the immunity challenge?', false, 'tribe', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440000', 'Premier', 'Whose name will be mispelled first?', false, 'survivor', NOW(), NOW());
