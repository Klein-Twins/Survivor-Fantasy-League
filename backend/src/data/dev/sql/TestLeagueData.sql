INSERT INTO "LGE_LEAGUE" ("LEAGUE_ID", "SEASON_ID", "NAME", "createdAt", "updatedAt")
VALUES ('c5ea9a19-c8cd-4dfc-af1b-44d3b0d4928f', 47, 'test', '2025-01-15 16:16:28.942-06', '2025-01-15 16:16:28.942-06');


--Dev for LGE_LEAGUES_PROFILES
--Includes an owner, a pending invite and an accepted invite for Tony Stark, Bruce Banner and Captan America respectively
INSERT INTO "LGE_LEAGUES_PROFILES" ("PROFILE_ID", "LEAGUE_ID", "ROLE", "INVITE_STATUS", "CREATED_AT", "UPDATED_AT")
VALUES ('48175a74-822b-4172-8665-355952d3bdc4', 'c5ea9a19-c8cd-4dfc-af1b-44d3b0d4928f', 'owner', 'accepted', '2025-01-15 16:16:28.946-06', '2025-01-15 16:16:28.946-06');

INSERT INTO "LGE_LEAGUES_PROFILES" ("PROFILE_ID", "LEAGUE_ID", "ROLE", "INVITE_STATUS", "CREATED_AT", "UPDATED_AT")
VALUES ('d67e1e8a-b4db-4a64-9d38-93db0a8fe5a6', 'c5ea9a19-c8cd-4dfc-af1b-44d3b0d4928f', 'member', 'accepted', '2025-01-15 16:16:28.946-06', '2025-01-15 16:16:28.946-06');

INSERT INTO "LGE_LEAGUES_PROFILES" ("PROFILE_ID", "LEAGUE_ID", "ROLE", "INVITE_STATUS", "CREATED_AT", "UPDATED_AT")
VALUES ('0088ed2a-ff8d-4fde-bebf-3f57ac6c0331', 'c5ea9a19-c8cd-4dfc-af1b-44d3b0d4928f', 'member', 'pending', '2025-01-15 16:16:28.946-06', '2025-01-15 16:16:28.946-06');
