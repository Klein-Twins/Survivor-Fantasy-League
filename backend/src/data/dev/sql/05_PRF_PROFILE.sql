DELETE FROM "PRF_PROFILE";
insert into "PRF_PROFILE" ("PROFILE_ID", "FIRST_NAME", "LAST_NAME", "CREATED_AT", "UPDATED_AT") 
values 
    ('48175a74-822b-4172-8665-355952d3bdc4', 'Tony', 'Stark', NOW(), NOW()),
    ('0088ed2a-ff8d-4fde-bebf-3f57ac6c0331', 'Captain', 'America', NOW(), NOW()),
    ('d67e1e8a-b4db-4a64-9d38-93db0a8fe5a6', 'Bruce', 'Banner', NOW(), NOW()),
    ('fb3706cd-7052-4c8b-a3f4-d3d02a60d879', 'Natasha', 'Romanoff', NOW(), NOW()),
    ('12e8c8be-13ea-4c96-91e0-55770764c073', 'Clint', 'Barton', NOW(), NOW()),
    ('2396d63a-5db8-4e9f-b697-d7278fe1c2f1', 'Thor', 'Odinson', NOW(), NOW()),
    ('b2573f4b-c3ca-4fe4-9efb-38db4c2db381', 'Wanda', 'Maximoff', NOW(), NOW()),
    ('fbfe5f57-b82f-4b9b-8461-3e68c91b6d56', 'Vision', 'Stone', NOW(), NOW()),
    ('b0d049c3-8b8f-4de6-bbb1-bab61e2e50f7', 'Sam', 'Wilson', NOW(), NOW()),
    ('a5c7c7b1-f742-4bbf-8768-7b070528ab70', 'Peter', 'Parker', NOW(), NOW()),
    ('fa9f6cfb-300f-42a1-91f2-b29f7082d438', 'Stephen', 'Strange', NOW(), NOW()),
    ('e23223e4-6d61-4875-9750-b842b82e4933', 'TChalla', 'Wakanda', NOW(), NOW());

DELETE FROM "USR_USERS";
insert into "USR_USERS" ("USER_ID", "USER_NAME", "USER_PROFILE_ID", "USER_EMAIL", "CREATED_AT", "UPDATED_AT") 
values 
    ('a103ac43-6e48-4625-8480-51d72293f765', 'tonystark', '48175a74-822b-4172-8665-355952d3bdc4', 'tony.stark@test.com', NOW(), NOW()),
    ('2f4824e4-0159-43da-ab37-4af63f482418', 'steverogers', '0088ed2a-ff8d-4fde-bebf-3f57ac6c0331', 'steve.rogers@test.com', NOW(), NOW()),
    ('a4fd4566-2d92-4c6e-b6a7-3f2e436edc9c', 'brucebanner', 'd67e1e8a-b4db-4a64-9d38-93db0a8fe5a6', 'bruce.banner@test.com', NOW(), NOW()),
    ('c87da514-f51f-4d44-9482-d8c4d8f84db6', 'blackwidow', 'fb3706cd-7052-4c8b-a3f4-d3d02a60d879', 'natasha.romanoff@test.com', NOW(), NOW()),
    ('fe535c77-f91e-42ec-b460-2edb2ad7d053', 'hawkeye', '12e8c8be-13ea-4c96-91e0-55770764c073', 'clint.barton@test.com', NOW(), NOW()),
    ('f6b9b9ab-3c2b-4c88-baf0-f7d2683035b7', 'thor', '2396d63a-5db8-4e9f-b697-d7278fe1c2f1', 'thor.odinson@test.com', NOW(), NOW()),
    ('f4bbd7e7-0e56-4002-8773-c0ef0eb2e104', 'scarletwitch', 'b2573f4b-c3ca-4fe4-9efb-38db4c2db381', 'wanda.maximoff@test.com', NOW(), NOW()),
    ('ae47a799-d2a6-45b4-94b9-6c2ab543e406', 'vision', 'fbfe5f57-b82f-4b9b-8461-3e68c91b6d56', 'vision.stone@test.com', NOW(), NOW()),
    ('d3fe8fc7-b5a3-4510-9a77-bf9ca9fd6cfd', 'falcon', 'b0d049c3-8b8f-4de6-bbb1-bab61e2e50f7', 'sam.wilson@test.com', NOW(), NOW()),
    ('1c6d1701-8c38-47d0-b09d-5ffb568ddba1', 'spiderman', 'a5c7c7b1-f742-4bbf-8768-7b070528ab70', 'peter.parker@test.com', NOW(), NOW()),
    ('80fae062-35c9-4cfa-8ca9-df79fc43e687', 'doctorstrange', 'fa9f6cfb-300f-42a1-91f2-b29f7082d438', 'stephen.strange@test.com', NOW(), NOW()),
    ('9b367473-492b-471e-9d4f-2e3f1e5fa274', 'blackpanther', 'e23223e4-6d61-4875-9750-b842b82e4933', 'tchalla.wakanda@test.com', NOW(), NOW());

DELETE FROM "USR_PASSWORDS";
insert into "USR_PASSWORDS" ("PASSWORD_SEQ", "USER_ID", "PASSWORD", "ACTIVE", "CREATED_AT", "UPDATED_AT") 
values 
    (1, 'a103ac43-6e48-4625-8480-51d72293f765', '$2b$10$zk8ke7G5h4htiPcdQ0AHoOVL2WupxtQb.4zUYyWRWfpQVSM6grXBu', true, NOW(), NOW()),
    (1, '2f4824e4-0159-43da-ab37-4af63f482418', '$2b$10$zk8ke7G5h4htiPcdQ0AHoOVL2WupxtQb.4zUYyWRWfpQVSM6grXBu', true, NOW(), NOW()),
    (1, 'a4fd4566-2d92-4c6e-b6a7-3f2e436edc9c', '$2b$10$zk8ke7G5h4htiPcdQ0AHoOVL2WupxtQb.4zUYyWRWfpQVSM6grXBu', true, NOW(), NOW()),
    (1, 'c87da514-f51f-4d44-9482-d8c4d8f84db6', '$2b$10$zk8ke7G5h4htiPcdQ0AHoOVL2WupxtQb.4zUYyWRWfpQVSM6grXBu', true, NOW(), NOW()),
    (1, 'fe535c77-f91e-42ec-b460-2edb2ad7d053', '$2b$10$zk8ke7G5h4htiPcdQ0AHoOVL2WupxtQb.4zUYyWRWfpQVSM6grXBu', true, NOW(), NOW()),
    (1, 'f6b9b9ab-3c2b-4c88-baf0-f7d2683035b7', '$2b$10$zk8ke7G5h4htiPcdQ0AHoOVL2WupxtQb.4zUYyWRWfpQVSM6grXBu', true, NOW(), NOW()),
    (1, 'f4bbd7e7-0e56-4002-8773-c0ef0eb2e104', '$2b$10$zk8ke7G5h4htiPcdQ0AHoOVL2WupxtQb.4zUYyWRWfpQVSM6grXBu', true, NOW(), NOW()),
    (1, 'ae47a799-d2a6-45b4-94b9-6c2ab543e406', '$2b$10$zk8ke7G5h4htiPcdQ0AHoOVL2WupxtQb.4zUYyWRWfpQVSM6grXBu', true, NOW(), NOW()),
    (1, 'd3fe8fc7-b5a3-4510-9a77-bf9ca9fd6cfd', '$2b$10$zk8ke7G5h4htiPcdQ0AHoOVL2WupxtQb.4zUYyWRWfpQVSM6grXBu', true, NOW(), NOW()),
    (1, '1c6d1701-8c38-47d0-b09d-5ffb568ddba1', '$2b$10$zk8ke7G5h4htiPcdQ0AHoOVL2WupxtQb.4zUYyWRWfpQVSM6grXBu', true, NOW(), NOW()),
    (1, '80fae062-35c9-4cfa-8ca9-df79fc43e687', '$2b$10$zk8ke7G5h4htiPcdQ0AHoOVL2WupxtQb.4zUYyWRWfpQVSM6grXBu', true, NOW(), NOW()),
    (1, '9b367473-492b-471e-9d4f-2e3f1e5fa274', '$2b$10$zk8ke7G5h4htiPcdQ0AHoOVL2WupxtQb.4zUYyWRWfpQVSM6grXBu', true, NOW(), NOW());