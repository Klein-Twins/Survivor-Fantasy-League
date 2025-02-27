import { BadRequestError } from '../errors/errors';

export const validateQuery = (seasonId: any): void => {
  // 1. Validate that seasonId is present
  if (!seasonId) {
    throw new BadRequestError('Missing seasonId');
  }

  // 2. Parse seasonId as an integer and ensure it is a valid number
  const season = parseInt(seasonId as string, 10);
  if (isNaN(season)) {
    throw new BadRequestError('seasonId must be a valid number');
  }
};
