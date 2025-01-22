CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DELETE FROM "CST_SURVIVORS";
INSERT INTO public."CST_SURVIVORS" ("SURVIVOR_ID", "FIRST_NAME", "NICK_NAME", "LAST_NAME", "FROM_CITY", "FROM_STATE", "FROM_COUNTRY")
VALUES
    (uuid_generate_v4(), 'Andy', null, 'Rueda', 'Brooklyn', 'New York', 'US'),
    (uuid_generate_v4(), 'Anika', null, 'Dhar','Los Angeles', 'California', 'US'),
    (uuid_generate_v4(), 'Aysha', null, 'Welch', 'Houston', 'Texas', 'US'),
    (uuid_generate_v4(), 'Caroline', null, 'Vidmar', 'Chicago', 'Illinois', 'US'),
    (uuid_generate_v4(), 'Gabe', null, 'Ortis', 'Baltimore', 'Maryland', 'US'),
    (uuid_generate_v4(), 'Genevieve', null, 'Mushaluk', 'Winnipeg', 'Manitoba', 'US'),
    (uuid_generate_v4(), 'Rome', null, 'Cooney', 'Phoenix', 'Arizona', 'US'),
    (uuid_generate_v4(), 'Jon', null, 'Lovett', 'Los Angeles', 'California', 'US'),
    (uuid_generate_v4(), 'Kishan', null, 'Patel', 'San Francisco', 'California', 'US'),
    (uuid_generate_v4(), 'Kyle', null, 'Ostwald', 'Cheboygan', 'Michigan', 'US'),
    (uuid_generate_v4(), 'Rachel', null, 'LaMont', 'Southfield', 'Michigan', 'US'),
    (uuid_generate_v4(), 'Sam', null, 'Phalen', 'Nashville', 'Tennessee', 'US'),
    (uuid_generate_v4(), 'Sierra', null, 'Wright', 'Pheonixville', 'Pennsylvania', 'US'),
    (uuid_generate_v4(), 'Solomon', 'Sol', 'Yi', 'Norwalk', 'Connecticut', 'US'),
    (uuid_generate_v4(), 'Sue', null, 'Smey', 'Putnam Valley', 'New York', 'US'),
    (uuid_generate_v4(), 'Teeny', null, 'Chirichillo', 'Manahawkin', 'New Jersey', 'US'),
    (uuid_generate_v4(), 'Terran', 'TK', 'Foster', null, 'Washington D.C.', 'US'),
    (uuid_generate_v4(), 'Tiyana', null, 'Hallums', 'Oahu', 'Hawaii', 'US');

DELETE FROM "SSN_SEASONS";
INSERT INTO "SSN_SEASONS" ("SEASON_ID", "THEME", "LOCATION", "NAME", "START_DATE", "END_DATE") VALUES (47, 'The New Era 2.0', 'Fiji, Oceania', null, '2023-09-13', '2023-12-20');

DELETE FROM "SSN_SURVIVORS";

INSERT INTO "SSN_SURVIVORS" ("SURVIVOR_ID", "SEASON_ID", "ORIGINAL_TRIBE_ID", "AGE", "DESCRIPTION", "JOB", "IMAGE_URL") VALUES 
   ((SELECT "SURVIVOR_ID" FROM "CST_SURVIVORS" WHERE "FIRST_NAME"='Andy' LIMIT 1), 47, null, 31, '', 'AI Research Assistant', 'images/survivors/AndyRueda47.jpeg'),
   ((SELECT "SURVIVOR_ID" FROM "CST_SURVIVORS" WHERE "FIRST_NAME"='Anika' LIMIT 1), 47, null, 26, '', 'Marketing Manager', 'images/survivors/AnikaDhar47.jpeg'),
   ((SELECT "SURVIVOR_ID" FROM "CST_SURVIVORS" WHERE "FIRST_NAME"='Aysha' LIMIT 1), 47, null, 32, '', 'Lavo', 'images/survivors/AyshaWelch47.jpeg'),
   ((SELECT "SURVIVOR_ID" FROM "CST_SURVIVORS" WHERE "FIRST_NAME"='Caroline' LIMIT 1), 47, null, 27, '', 'Strategy Consultant', 'images/survivors/CarolineVidmar47.jpeg'),
   ((SELECT "SURVIVOR_ID" FROM "CST_SURVIVORS" WHERE "FIRST_NAME"='Gabe' LIMIT 1), 47, null, 26, '', 'Radio Host', 'images/survivors/GabeOrtis47.jpeg'),
   ((SELECT "SURVIVOR_ID" FROM "CST_SURVIVORS" WHERE "FIRST_NAME"='Genevieve' LIMIT 1), 47, null, 33, '', 'Corporate Lawyer', 'images/survivors/GenevieveMushaluk47.jpeg'),
   ((SELECT "SURVIVOR_ID" FROM "CST_SURVIVORS" WHERE "FIRST_NAME"='Rome' LIMIT 1), 47, null, 30, '', 'E-Sports Commentator', 'images/survivors/RomeCooney47.jpeg'),
   ((SELECT "SURVIVOR_ID" FROM "CST_SURVIVORS" WHERE "FIRST_NAME"='Jon' LIMIT 1), 47, null, 42, '', 'Podcast Host', 'images/survivors/JonLovett47.jpeg'),
   ((SELECT "SURVIVOR_ID" FROM "CST_SURVIVORS" WHERE "FIRST_NAME"='Kishan' LIMIT 1), 47, null, 28, '', 'Emergency Room Doctor', 'images/survivors/KishanPatel47.jpeg'),
   ((SELECT "SURVIVOR_ID" FROM "CST_SURVIVORS" WHERE "FIRST_NAME"='Kyle' LIMIT 1), 47, null, 31, '', 'Construction Worker', 'images/survivors/KyleOstwald47.jpeg'),
   ((SELECT "SURVIVOR_ID" FROM "CST_SURVIVORS" WHERE "FIRST_NAME"='Rachel' LIMIT 1), 47, null, 34, '', 'Graphic Designer', 'images/survivors/RachelLaMont47.jpeg'),
   ((SELECT "SURVIVOR_ID" FROM "CST_SURVIVORS" WHERE "FIRST_NAME"='Sam' LIMIT 1), 47, null, 24, '', 'Sports Recruiter', 'images/survivors/SamPhalen47.jpeg'),
   ((SELECT "SURVIVOR_ID" FROM "CST_SURVIVORS" WHERE "FIRST_NAME"='Sierra' LIMIT 1), 47, null, 27, '', 'Nurse', 'images/survivors/SierraWright47.jpeg'),
   ((SELECT "SURVIVOR_ID" FROM "CST_SURVIVORS" WHERE "FIRST_NAME"='Solomon' LIMIT 1), 47, null, 43, '', 'Medical Device Sales', 'images/survivors/SolomonYi47.jpeg'),
   ((SELECT "SURVIVOR_ID" FROM "CST_SURVIVORS" WHERE "FIRST_NAME"='Sue' LIMIT 1), 47, null, 59, '', 'Flight School Owner', 'images/survivors/SueSmey47.jpeg'),
   ((SELECT "SURVIVOR_ID" FROM "CST_SURVIVORS" WHERE "FIRST_NAME"='Teeny' LIMIT 1), 47, null, 23, '', 'Freelance Writer', 'images/survivors/TeenyChirichillo47.jpeg'),
   ((SELECT "SURVIVOR_ID" FROM "CST_SURVIVORS" WHERE "FIRST_NAME"='Terran' LIMIT 1), 47, null, 31, '', 'Athlete Marketing Manager', 'images/survivors/TerranFoster47.jpeg'),
   ((SELECT "SURVIVOR_ID" FROM "CST_SURVIVORS" WHERE "FIRST_NAME"='Tiyana' LIMIT 1), 47, null, 27, '', 'Flight Attendant', 'images/survivors/TiyanaHallums47.jpeg');