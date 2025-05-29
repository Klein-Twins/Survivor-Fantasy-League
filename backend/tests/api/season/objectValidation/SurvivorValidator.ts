import { models } from '../../../../src/config/db';
import { Survivor } from '../../../../src/generated-api';
import { SeasonsAttributes } from '../../../../src/models/season/Seasons';
import { SurvivorDetailsOnSeasonAttributes } from '../../../../src/models/survivors/SurvivorDetailsOnSeason';
import {
  SURVIVOR_TO_DETAILS_ON_SEASON,
  SurvivorsAttributes,
} from '../../../../src/models/survivors/Survivors';
import { ArrayValidator } from '../../../utils/objectValidator';

export class SurvivorValidator implements ArrayValidator<Survivor> {
  async validateArray(
    arr: Survivor[],
    seasonId: SeasonsAttributes['seasonId']
  ): Promise<void> {
    const survivors = arr;
    expect(Array.isArray(survivors)).toBe(true);
    const survivorDbCount = await models.SurvivorDetailsOnSeason.count({
      where: { seasonId },
    });
    expect(survivorDbCount).toBe(survivors.length);
  }

  validatePrimitives(
    obj: Survivor,
    seasonId: SeasonsAttributes['seasonId']
  ): void {
    const survivor = obj;
    expect(survivor).toHaveProperty('seasonId');
    expect(survivor.seasonId).toBe(seasonId);

    expect(survivor).toHaveProperty('id');
    expect(typeof survivor.id).toBe('string');

    expect(survivor).toHaveProperty('name');
    expect(typeof survivor.name).toBe('string');

    expect(survivor).toHaveProperty('nickName');
    if (survivor.nickName !== null) {
      expect(typeof survivor.nickName).toBe('string');
    }

    expect(survivor).toHaveProperty('fromCity');
    if (survivor.fromCity !== null) {
      expect(typeof survivor.fromCity).toBe('string');
    }

    expect(survivor).toHaveProperty('fromState');
    expect(typeof survivor.fromState).toBe('string');

    expect(survivor).toHaveProperty('fromCountry');
    expect(typeof survivor.fromCountry).toBe('string');

    expect(survivor).toHaveProperty('age');
    expect(typeof survivor.age).toBe('number');

    expect(survivor).toHaveProperty('description');
    expect(typeof survivor.description).toBe('string');

    expect(survivor).toHaveProperty('job');
    expect(typeof survivor.job).toBe('string');

    expect(survivor).toHaveProperty('firstName');
    expect(typeof survivor.firstName).toBe('string');

    expect(survivor).toHaveProperty('lastName');
    expect(typeof survivor.lastName).toBe('string');
  }

  async validateDb(obj: Survivor): Promise<void> {
    const survivor = obj;
    const survivorDb = (await models.Survivors.findOne({
      where: { id: survivor.id },
      include: [
        {
          model: models.SurvivorDetailsOnSeason,
          required: true,
          as: SURVIVOR_TO_DETAILS_ON_SEASON,
          where: { seasonId: survivor.seasonId },
        },
      ],
    })) as unknown as SurvivorsAttributes & {
      [SURVIVOR_TO_DETAILS_ON_SEASON]: SurvivorDetailsOnSeasonAttributes[];
    };

    expect(survivorDb).toBeDefined();
    expect(survivorDb).not.toBeNull();

    expect(survivorDb.id).toBe(survivor.id);
    expect(survivorDb.firstName).toBe(survivor.firstName);
    expect(survivorDb.lastName).toBe(survivor.lastName);
    expect(survivorDb.fromState).toBe(survivor.fromState);
    expect(survivorDb.fromCountry).toBe(survivor.fromCountry);
    expect(survivorDb.nickName).toBe(survivor.nickName);
    expect(survivorDb.fromCity).toBe(survivor.fromCity);

    expect(survivorDb[SURVIVOR_TO_DETAILS_ON_SEASON].length).toBe(1);
    const survivorDetails = survivorDb[SURVIVOR_TO_DETAILS_ON_SEASON][0];

    expect(survivorDetails.age).toBe(survivor.age);
    expect(survivorDetails.description).toBe(survivor.description);
    expect(survivorDetails.job).toBe(survivor.job);
    expect(survivorDetails.seasonId).toBe(survivor.seasonId);
    expect(survivorDetails.id).toBe(survivor.id);
  }

  async validateObjectDependencies(
    obj: Survivor,
    seasonId: SeasonsAttributes['seasonId']
  ): Promise<void> {
    //TODO: Test finishstatus
  }
}
