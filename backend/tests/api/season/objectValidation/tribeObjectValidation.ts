import { models } from '../../../../src/config/db';
import { EpisodeType, Tribe } from '../../../../src/generated-api';
import { SeasonsAttributes } from '../../../../src/models/season/Seasons';
import { TRIBEMEMBER_TO_EPISODE_STARTED } from '../../../../src/models/season/TribeMembers';
import { SURVIVORSEASON_TO_TRIBE } from '../../../../src/models/survivors/SurvivorDetailsOnSeason';
import { SURVIVOR_TO_DETAILS_ON_SEASON } from '../../../../src/models/survivors/Survivors';

export async function validateTribesObjects(
  seasonId: SeasonsAttributes['seasonId'],
  tribes: Tribe[]
) {
  expect(Array.isArray(tribes)).toBe(true);

  const numTribesDb = await models.Tribe.count({
    where: {
      seasonId: seasonId,
    },
  });
  expect(numTribesDb).toBe(tribes.length);

  for (const tribe of tribes) {
    await validateTribeObject(seasonId, tribe);
  }
}

async function validateTribeObject(
  seasonId: SeasonsAttributes['seasonId'],
  tribe: Tribe
) {
  expect(tribe).toHaveProperty('id');
  expect(typeof tribe.id).toBe('string');
  expect(tribe).toHaveProperty('name');
  expect(typeof tribe.name).toBe('string');
  expect(tribe).toHaveProperty('color');
  expect(typeof tribe.color).toBe('object');
  expect(tribe.color).toHaveProperty('name');
  expect(typeof tribe.color.name).toBe('string');
  expect(tribe.color).toHaveProperty('hex');
  expect(typeof tribe.color.hex).toBe('string');

  expect(tribe.isMergeTribe).toBe(
    tribe.isMergeTribe === undefined || typeof tribe.isMergeTribe === 'boolean'
  );

  expect(tribe.episodeStarted).toBe(
    tribe.episodeStarted === null ||
      (typeof tribe.episodeStarted === 'string' &&
        tribe.episodeStarted.length > 0)
  );

  expect(tribe).toHaveProperty('startingSurvivors');
  // Validate startingSurvivors
  expect(Array.isArray(tribe.startingSurvivors)).toBe(true);
  for (const surv of tribe.startingSurvivors) {
    expect(surv).toHaveProperty('id');
    expect(typeof surv.id).toBe('string');
    expect(surv).toHaveProperty('name');
    expect(typeof surv.name).toBe('string');
    expect(surv).toHaveProperty('firstName');
    expect(typeof surv.firstName).toBe('string');
    expect(surv).toHaveProperty('lastName');
    expect(typeof surv.lastName).toBe('string');

    const survivorDb = await models.Survivors.findOne({
      where: { id: surv.id },
      include: [
        {
          model: models.SurvivorDetailsOnSeason,
          where: { seasonId: seasonId },
          required: true,
          as: SURVIVOR_TO_DETAILS_ON_SEASON,
          include: [
            {
              model: models.Tribe,
              required: true,
              as: SURVIVORSEASON_TO_TRIBE,
              where: {
                id: tribe.id,
              },
              include: [
                {
                  model: models.TribeMembers,
                  required: true,
                  where: {
                    survivorId: surv.id,
                  },
                  include: [
                    {
                      model: models.Episode,
                      as: TRIBEMEMBER_TO_EPISODE_STARTED,
                      required: true,
                      where: {
                        type: EpisodeType.PREMIERE,
                        seasonId: seasonId,
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    expect(survivorDb).toBeDefined();
  }
}
