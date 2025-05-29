import { UUID } from 'crypto';
import { models } from '../../../../src/config/db';
import { Episode, EpisodeType } from '../../../../src/generated-api';
import { SeasonsAttributes } from '../../../../src/models/season/Seasons';
import { expectDatesToBeEqual } from '../../../utils/dateComparison';
import { expectEnumValue } from '../../../utils/enumValidator';
import {
  ArrayValidator,
  ObjectValidator,
} from '../../../utils/objectValidator';
import validator from 'validator';

export class EpisodeValidator implements ArrayValidator<Episode> {
  async validateArray(
    arr: Episode[],
    seasonId: SeasonsAttributes['seasonId']
  ): Promise<void> {
    const episodes = arr;
    expect(Array.isArray(episodes)).toBe(true);
    const episodeDbCount = await models.Episode.count({
      where: { seasonId },
    });
    expect(episodeDbCount).toBe(episodes.length);
  }

  validatePrimitives(
    obj: Episode,
    seasonId: SeasonsAttributes['seasonId']
  ): void {
    const episode = obj;

    expect(episode).toHaveProperty('id');
    expect(typeof episode.id).toBe('string');

    expect(episode).toHaveProperty('seasonId');
    expect(typeof episode.seasonId).toBe('number');

    expect(episode).toHaveProperty('number');
    expect(typeof episode.number).toBe('number');

    expect(episode).toHaveProperty('airDate');
    expect(typeof episode.airDate === 'string').toBe(true);

    expect(episode).toHaveProperty('title');
    expect(typeof episode.title === 'string' || episode.title === null).toBe(
      true
    );

    expect(episode).toHaveProperty('description');
    expect(
      typeof episode.description === 'string' || episode.description === null
    ).toBe(true);

    expect(episode).toHaveProperty('hasAired');
    expect(typeof episode.hasAired).toBe('boolean');

    expect(episode).toHaveProperty('episodeType');
    expect(typeof episode.episodeType).toBe('string');
    expectEnumValue(EpisodeType, episode.episodeType);

    expect(episode).toHaveProperty('isTribeSwitch');
    expect(typeof episode.isTribeSwitch).toBe('boolean');
  }

  async validateDb(
    obj: Episode,
    seasonId: SeasonsAttributes['seasonId']
  ): Promise<void> {
    const episode = obj;
    const episodeDb = await models.Episode.findOne({
      where: {
        id: episode.id,
      },
    });

    if (!episodeDb) {
      throw new Error(
        `Episode with id ${episode.id} not found in the database.`
      );
    } else {
      expect(episodeDb.id).toBe(episode.id);
      expect(episodeDb.seasonId).toBe(episode.seasonId);
      expect(episodeDb.number).toBe(episode.number);
      expectDatesToBeEqual(episodeDb.airDate, episode.airDate);
      expect(episodeDb.title).toBe(episode.title);
      expect(episodeDb.description).toBe(episode.description);
      expect(episodeDb.type).toBe(episode.episodeType);
    }

    const episodeHasTribeSwitch =
      (
        await models.TribeMembers.findOne({
          where: {
            isTribeSwitch: true,
            episodeIdStart: episode.id,
          },
        })
      )?.isTribeSwitch || false;

    expect(episode.isTribeSwitch).toBe(episodeHasTribeSwitch);
  }

  validateObjectDependencies(
    obj: Episode,
    seasonId: SeasonsAttributes['seasonId']
  ): Promise<void> {
    const episode = obj;

    //validate airdate:
    //Case: airdate is in the past - hasaired should be true
    //Case: airdate is in the future - hasaired should be false
    if (episode.airDate) {
      const airDate = new Date(episode.airDate);
      const currentDate = new Date();
      if (airDate < currentDate) {
        expect(episode.hasAired).toBe(true);
      } else {
        expect(episode.hasAired).toBe(false);
      }
    } else {
      expect(episode.hasAired).toBe(false);
    }

    return Promise.resolve();
  }
}

export class NextEpisodeValidator implements ObjectValidator<UUID> {
  validatePrimitives(
    obj: `${string}-${string}-${string}-${string}-${string}`,
    seasonId?: SeasonsAttributes['seasonId']
  ): void {
    const nextEpisodeId = obj;
    if (nextEpisodeId === null) {
      expect(nextEpisodeId).toBeNull();
    } else {
      expect(typeof nextEpisodeId).toBe('string');
      if (!validator.isUUID(nextEpisodeId)) {
        throw new Error(`Invalid UUID format: ${nextEpisodeId}`);
      }
    }
  }
  async validateDb(
    obj: `${string}-${string}-${string}-${string}-${string}`,
    seasonId: SeasonsAttributes['seasonId']
  ): Promise<void> {
    const nextEpisodeId = obj;
    if (obj === null) {
    } else {
      const nextEpisode = await models.Episode.findOne({
        where: {
          id: nextEpisodeId,
        },
      });
      if (!nextEpisode) {
        throw new Error(
          `Next episode with id ${nextEpisodeId} not found in the database.`
        );
      }
      expect(seasonId).toBe(nextEpisode.seasonId);
      expect(nextEpisode.id).toBe(nextEpisodeId);

      const episodesInSeasonDb = await models.Episode.findAll({
        where: {
          seasonId,
        },
      });
      if (!episodesInSeasonDb.some((ep) => ep.id === nextEpisodeId)) {
        throw new Error(
          `Next episode with id ${nextEpisodeId} is not part of the season with id ${seasonId}.`
        );
      }
      //if next episode has aired, then it should fail
      if (nextEpisode.airDate && new Date(nextEpisode.airDate) < new Date()) {
        throw new Error(
          `Next episode with id ${nextEpisodeId} has already aired.`
        );
      }
    }
  }
  validateObjectDependencies(
    obj: `${string}-${string}-${string}-${string}-${string}`,
    seasonId?: SeasonsAttributes['seasonId']
  ): Promise<void> {
    return Promise.resolve();
  }
}
