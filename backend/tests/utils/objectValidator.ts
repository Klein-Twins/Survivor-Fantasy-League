import { SeasonsAttributes } from '../../src/models/season/Seasons';

export interface ObjectValidator<T> {
  validatePrimitives(obj: T, seasonId?: SeasonsAttributes['seasonId']): void;
  validateDb(obj: T, seasonId?: SeasonsAttributes['seasonId']): Promise<void>;
  validateObjectDependencies(
    obj: T,
    seasonId?: SeasonsAttributes['seasonId']
  ): Promise<void>;
}

export interface ArrayValidator<T> extends ObjectValidator<T> {
  validateArray(
    arr: T[],
    seasonId?: SeasonsAttributes['seasonId']
  ): Promise<void>;
}

// Type guard for Season
function isSeason(obj: any): obj is { id: number } {
  return (
    obj && typeof obj === 'object' && 'id' in obj && typeof obj.id === 'number'
  );
}
// Overload for Season-like objects (with id)
export async function runValidation<T extends { id: number }>(
  validator: ObjectValidator<T> | (ObjectValidator<T> & ArrayValidator<T>),
  obj: T | T[]
): Promise<void>;

// Overload for other objects (seasonId required)
export async function runValidation<T>(
  validator: ObjectValidator<T> | (ObjectValidator<T> & ArrayValidator<T>),
  obj: T | T[],
  seasonId: SeasonsAttributes['seasonId']
): Promise<void>;

export async function runValidation<T>(
  validator: ObjectValidator<T> | (ObjectValidator<T> & ArrayValidator<T>),
  obj: T | T[],
  seasonId?: SeasonsAttributes['seasonId']
): Promise<void> {
  // If obj is a Season (has id), extract seasonId
  if (
    isSeason(obj) ||
    (Array.isArray(obj) && obj.length > 0 && isSeason(obj[0]))
  ) {
    // TypeScript now knows obj has id
    const resolvedSeasonId = Array.isArray(obj)
      ? (obj[0] as any).id
      : (obj as any).id;

    if (
      Array.isArray(obj) &&
      'validateArray' in validator &&
      typeof validator.validateArray === 'function'
    ) {
      await validator.validateArray(obj, resolvedSeasonId);
      for (const item of obj) {
        try {
          validator.validatePrimitives(item, resolvedSeasonId);
          await validator.validateDb(item, resolvedSeasonId);
          await validator.validateObjectDependencies(item, resolvedSeasonId);
        } catch (error) {
          console.error(
            `Validation failed for seasonId: ${resolvedSeasonId} for item: ${JSON.stringify(
              item
            )}`
          );
          throw error;
        }
      }
    } else {
      validator.validatePrimitives(obj as T, resolvedSeasonId);
      await validator.validateDb(obj as T, resolvedSeasonId);
    }
    return;
  }

  // For non-Season objects, seasonId is required
  if (seasonId === undefined) {
    throw new Error('seasonId is required for non-Season objects');
  }

  if (
    Array.isArray(obj) &&
    'validateArray' in validator &&
    typeof validator.validateArray === 'function'
  ) {
    await validator.validateArray(obj, seasonId);
    for (const item of obj) {
      try {
        validator.validatePrimitives(item, seasonId);
        await validator.validateDb(item, seasonId);
        await validator.validateObjectDependencies(item, seasonId);
      } catch (error) {
        console.error(
          `Validation failed for seasonId: ${seasonId} for item of type: ${
            item?.constructor?.name || typeof item
          } - ${JSON.stringify(item)}`
        );
        throw error;
      }
    }
  } else {
    validator.validatePrimitives(obj as T, seasonId);
    await validator.validateDb(obj as T, seasonId);
  }
}
