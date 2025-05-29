import { models } from '../../../../src/config/db';
import { Tribe } from '../../../../src/generated-api';
import { SeasonsAttributes } from '../../../../src/models/season/Seasons';
import {
  TRIBEMEMBER_TO_SEASONSURVIVOR,
  TribeMemberAttributes,
} from '../../../../src/models/season/TribeMembers';
import {
  SurvivorDetailsOnSeasonAttributes,
  SURVIVORSEASON_TO_SURVIVOR,
} from '../../../../src/models/survivors/SurvivorDetailsOnSeason';
import { SurvivorsAttributes } from '../../../../src/models/survivors/Survivors';
import { expectColor } from '../../../utils/colorValidator';
import { ArrayValidator } from '../../../utils/objectValidator';
import { expectUUID } from '../../../utils/uuidValidator';

export class TribeValidator implements ArrayValidator<Tribe> {
  async validateArray(
    arr: Tribe[],
    seasonId: SeasonsAttributes['seasonId']
  ): Promise<void> {
    const tribes = arr;
    expect(Array.isArray(tribes)).toBe(true);

    const tribeDbCount = await models.Tribe.count({
      where: {
        seasonId: seasonId,
      },
    });

    expect(tribeDbCount).toBe(tribes.length);
  }

  validatePrimitives(
    obj: Tribe,
    seasonId: SeasonsAttributes['seasonId']
  ): void {
    const tribe = obj;
    expect(tribe).toHaveProperty('id');
    expect(tribe.id).toBeDefined();
    expectUUID(tribe.id);

    expect(tribe).toHaveProperty('name');
    expect(typeof tribe.name).toBe('string');

    expectColor(tribe.color);

    expect(tribe.isMergeTribe).toBeDefined();
    expect(typeof tribe.isMergeTribe).toBe('boolean');

    expect(tribe).toHaveProperty('episodeStarted');
    expect(
      typeof tribe.episodeStarted === 'string' || tribe.episodeStarted === null
    ).toBe(true);
    if (tribe.episodeStarted !== null) {
      expectUUID(tribe.episodeStarted);
    }
  }

  async validateDb(
    obj: Tribe,
    seasonId: SeasonsAttributes['seasonId']
  ): Promise<void> {
    const tribe = obj;

    const tribeDb = await models.Tribe.findOne({
      where: {
        id: tribe.id,
        seasonId: seasonId,
      },
    });

    if (!tribeDb) {
      throw new Error(`Tribe with id ${tribe.id} not found in the database.`);
    }

    expect(tribeDb.id).toBe(tribe.id);
    expect(tribeDb.name).toBe(tribe.name);
    expect(tribeDb.mergeTribe).toBe(tribe.isMergeTribe);
    expect(tribeDb.seasonId).toBe(seasonId);
    expect(tribeDb.color).toBe(tribe.color.name);
    expect(tribeDb.hexColor).toBe(tribe.color.hex);
    expect(tribeDb.episodeIdStart).toBe(tribe.episodeStarted);
  }

  async validateObjectDependencies(
    obj: Tribe,
    seasonId: SeasonsAttributes['seasonId']
  ): Promise<void> {
    //Expect the episodeStarted to be a valid UUID or null as well as a valid episode
    //Expect the starting survivors to be an array

    const tribe = obj;
    expect(tribe).toHaveProperty('startingSurvivors');
    expect(Array.isArray(tribe.startingSurvivors)).toBe(true);

    const survivorsDb = (await models.TribeMembers.findAll({
      where: {
        tribeId: tribe.id,
        episodeIdStart: tribe.episodeStarted,
      },
      include: [
        {
          model: models.SurvivorDetailsOnSeason,
          required: true,
          as: TRIBEMEMBER_TO_SEASONSURVIVOR,
          where: { seasonId: seasonId },
          include: [
            {
              model: models.Survivors,
              required: true,
              as: SURVIVORSEASON_TO_SURVIVOR,
            },
          ],
        },
      ],
    })) as unknown as (TribeMemberAttributes & {
      [TRIBEMEMBER_TO_SEASONSURVIVOR]: SurvivorDetailsOnSeasonAttributes & {
        [SURVIVORSEASON_TO_SURVIVOR]: SurvivorsAttributes;
      };
    })[];

    expect(survivorsDb.length).toBe(tribe.startingSurvivors.length);

    for (const startingSurvivor of tribe.startingSurvivors) {
      const survivorDb = survivorsDb.find(
        (s) => s.survivorId === startingSurvivor.id
      );

      const survivorBasicDb =
        survivorDb?.[TRIBEMEMBER_TO_SEASONSURVIVOR][SURVIVORSEASON_TO_SURVIVOR];

      if (!survivorBasicDb) {
        throw new Error(
          `Survivor with id ${startingSurvivor.id} not found in the database.`
        );
      }

      expect(startingSurvivor).toHaveProperty('id');
      expectUUID(startingSurvivor.id);
      expect(startingSurvivor.id).toBe(survivorBasicDb.id);

      expect(startingSurvivor).toHaveProperty('name');
      expect(typeof startingSurvivor.name).toBe('string');
      expect(startingSurvivor.name.length).toBeGreaterThan(0);

      expect(startingSurvivor).toHaveProperty('firstName');
      expect(typeof startingSurvivor.firstName).toBe('string');
      expect(startingSurvivor.firstName.length).toBeGreaterThan(0);
      expect(startingSurvivor.firstName).toBe(survivorBasicDb.firstName);

      expect(startingSurvivor).toHaveProperty('lastName');
      expect(typeof startingSurvivor.lastName).toBe('string');
      expect(startingSurvivor.lastName.length).toBeGreaterThan(0);
      expect(startingSurvivor.lastName).toBe(survivorBasicDb.lastName);
    }
  }
}
