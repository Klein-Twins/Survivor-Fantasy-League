INSERT INTO "LGE_LEAGUE" ("LEAGUE_ID", "SEASON_ID", "NAME", "createdAt", "updatedAt")
VALUES ('c5ea9a19-c8cd-4dfc-af1b-44d3b0d4928f', 47, 'The Chicken Race on the island', '2025-01-15 16:16:28.942-06', '2025-01-15 16:16:28.942-06');


--Dev for LGE_LEAGUES_PROFILES
--Includes an owner, a pending invite and an accepted invite for Tony Stark, Bruce Banner and Captan America respectively
INSERT INTO "LGE_LEAGUES_PROFILES" ("ID", "PROFILE_ID", "LEAGUE_ID", "ROLE", "INVITE_STATUS", "CREATED_AT", "UPDATED_AT")
VALUES ('9d8c7b6a-5e4f-3d2c-1b0a-9876543210fe', '48175a74-822b-4172-8665-355952d3bdc4', 'c5ea9a19-c8cd-4dfc-af1b-44d3b0d4928f', 'owner', 'accepted', '2025-01-15 16:16:28.946-06', '2025-01-15 16:16:28.946-06');

INSERT INTO "LGE_LEAGUES_PROFILES" ("ID", "PROFILE_ID", "LEAGUE_ID", "ROLE", "INVITER_PROFILE_ID" ,"INVITE_STATUS", "CREATED_AT", "UPDATED_AT")
VALUES ('b1c2d3e4-f5a6-7890-1234-567890abcdef','d67e1e8a-b4db-4a64-9d38-93db0a8fe5a6', 'c5ea9a19-c8cd-4dfc-af1b-44d3b0d4928f', 'member', '48175a74-822b-4172-8665-355952d3bdc4', 'accepted', '2025-01-15 16:16:28.946-06', '2025-01-15 16:16:28.946-06');

INSERT INTO "LGE_LEAGUES_PROFILES" ("ID", "PROFILE_ID", "LEAGUE_ID", "ROLE", "INVITER_PROFILE_ID", "INVITE_STATUS", "CREATED_AT", "UPDATED_AT")
VALUES ('a9b8c7d6-e5f4-3210-9876-543210fedcba' ,'0088ed2a-ff8d-4fde-bebf-3f57ac6c0331', 'c5ea9a19-c8cd-4dfc-af1b-44d3b0d4928f', 'member', '48175a74-822b-4172-8665-355952d3bdc4', 'pending', '2025-01-15 16:16:28.946-06', '2025-01-15 16:16:28.946-06');
