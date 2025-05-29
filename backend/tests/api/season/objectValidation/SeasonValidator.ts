import { models } from '../../../../src/config/db';
import { Season } from '../../../../src/generated-api';
import { SeasonsAttributes } from '../../../../src/models/season/Seasons';
import { ArrayValidator, runValidation } from '../../../utils/objectValidator';
import { EpisodeValidator, NextEpisodeValidator } from './EpisodeValidator';
import { SurvivorValidator } from './SurvivorValidator';
import { TribeValidator } from './TribeValidator';

export class SeasonValidator implements ArrayValidator<Season> {
  async validateArray(arr: Season[], seasonId: number): Promise<void> {
    const seasons = arr;
    expect(Array.isArray(seasons)).toBe(true);
    const seasonDbCount = await models.Seasons.count({
      where: { seasonId },
    });
    expect(seasonDbCount).toBe(seasons.length);
  }

  validatePrimitives(obj: Season, seasonId: number): void {
    const season = obj;
    expect(season).toHaveProperty('id');
    expect(season.id).toBe(seasonId);

    expect(season).toHaveProperty('name');
    expect(typeof season.name).toBe('string');

    expect(season).toHaveProperty('startDate');
    //expect startDate to be a string or null
    expect(
      typeof season.startDate === 'string' || season.startDate === null
    ).toBe(true);

    expect(season).toHaveProperty('endDate');
    //expect endDate to be a string or null
    expect(typeof season.endDate === 'string' || season.endDate === null).toBe(
      true
    );

    expect(season).toHaveProperty('location');
    expect(typeof season.location).toBe('string');

    expect(season).toHaveProperty('theme');
    expect(typeof season.theme).toBe('string');

    expect(season).toHaveProperty('isActive');
    expect(typeof season.isActive).toBe('boolean');
  }

  async validateDb(obj: Season, seasonId: number): Promise<void> {
    const season = obj;
    const seasonDb = await models.Seasons.findOne({
      where: { seasonId: season.id },
    });

    expect(seasonDb).toBeDefined();
    expect(seasonDb).not.toBeNull();

    expect(seasonDb!.seasonId).toBe(season.id);
    expect(seasonDb!.name).toBe(season.name);
    if (season.startDate !== null && seasonDb!.startDate !== null) {
      expect(new Date(seasonDb!.startDate).getTime()).toBe(
        new Date(season.startDate).getTime()
      );
    } else if (season.startDate === null && seasonDb!.startDate === null) {
      // Good
    } else {
      expect(
        seasonDb!.startDate
          ? new Date(seasonDb!.startDate).getTime()
          : seasonDb!.startDate
      ).toBe(
        season.startDate
          ? new Date(season.startDate).getTime()
          : season.startDate
      );
    }

    if (season.endDate !== null && seasonDb!.endDate !== null) {
      expect(new Date(seasonDb!.endDate).getTime()).toBe(
        new Date(season.endDate).getTime()
      );
    } else if (season.endDate === null && seasonDb!.endDate === null) {
      // Good
    } else {
      expect(
        seasonDb!.endDate
          ? new Date(seasonDb!.endDate).getTime()
          : seasonDb!.endDate
      ).toBe(
        season.endDate ? new Date(season.endDate).getTime() : season.endDate
      );
    }

    expect(seasonDb!.location).toBe(season.location);
    expect(seasonDb!.theme).toBe(season.theme);
    expect(seasonDb!.isActive).toBe(season.isActive);
  }

  async validateObjectDependencies(
    obj: Season,
    seasonId: SeasonsAttributes['seasonId']
  ): Promise<void> {
    const season = obj;

    // Validate survivors
    const survivorValidator = new SurvivorValidator();
    await runValidation(survivorValidator, season.survivors, season.id);

    // Validate episodes
    const episodeValidator = new EpisodeValidator();
    await runValidation(episodeValidator, season.episodes, season.id);

    // Validate nextEpisode
    const nextEpisodeValidator = new NextEpisodeValidator();
    await runValidation(nextEpisodeValidator, season.nextEpisode, season.id);

    // Validate tribesInSeason
    const tribeValidator = new TribeValidator();
    await runValidation(tribeValidator, season.tribesInSeason, season.id);
  }
}
