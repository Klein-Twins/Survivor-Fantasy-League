import logger from '../../config/logger';
import {
  CreateSeasonRequestBody,
  Season,
  Survivor,
  Tribe,
} from '../../generated-api';
import { SeasonsAttributes } from '../../models/season/Seasons';
import seasonService from '../../services/season/seasonService';
import { BadRequestError, NotFoundError } from '../../utils/errors/errors';

const seasonHelper = {
  validateSeasonId,
  buildSeason,
  formatSeasonId,
  validateCreateSeasonRequest,
};

function buildSeason(
  seasonAttributes: SeasonsAttributes,
  survivors: Survivor[],
  tribes: Tribe[]
): Season {
  return {
    id: seasonAttributes.seasonId,
    name: seasonAttributes.name,
    startDate: seasonAttributes.startDate.toString(),
    endDate: seasonAttributes.endDate.toString(),
    location: seasonAttributes.location,
    theme: seasonAttributes.theme,
    isActive: seasonAttributes.isActive,
    survivors: survivors,
    tribes: tribes,
  };
}

async function validateCreateSeasonRequest(reqBody: CreateSeasonRequestBody) {
  if (!reqBody.seasonNumber) {
    throw new BadRequestError('Season number is required');
  }
  const seasonNumber = Number(reqBody.seasonNumber);
  if (isNaN(seasonNumber)) {
    throw new BadRequestError('Season number must be a valid number');
  }

  if (!reqBody.theme) {
    throw new BadRequestError('Theme is required');
  }

  if (!reqBody.location) {
    throw new BadRequestError('Location is required');
  }

  if (!reqBody.startDate) {
    throw new BadRequestError('Start date is required');
  }
  if (isNaN(Date.parse(reqBody.startDate))) {
    throw new BadRequestError('Start date must be a valid date');
  }

  if (!reqBody.endDate) {
    throw new BadRequestError('End date is required');
  }
  if (isNaN(Date.parse(reqBody.endDate))) {
    throw new BadRequestError('End date must be a valid date');
  }

  if (!reqBody.isActive) {
    throw new BadRequestError('Is active is required');
  }
  logger.info(
    `Is active: ${reqBody.isActive} and type = ${typeof reqBody.isActive}`
  );
  if (
    typeof reqBody.isActive !== 'boolean' &&
    reqBody.isActive !== 'true' &&
    reqBody.isActive !== 'false'
  ) {
    throw new BadRequestError('Is active must be a boolean');
  }

  if (!reqBody.name) {
    throw new BadRequestError('Name is required');
  }
  if (!/^[a-zA-Z0-9,. ]*$/.test(reqBody.name)) {
    throw new BadRequestError(
      'Name must be alphanumeric, accepting space, period, or comma'
    );
  }
}

async function validateSeasonId(seasonId: string): Promise<void> {
  if (!seasonId) {
    throw new BadRequestError('Season id is required');
  }
  if (!isSeasonIdValid(seasonId)) {
    throw new BadRequestError('Invalid season id');
  }

  if (!(await doesSeasonIdExist(Number(seasonId)))) {
    throw new NotFoundError('Season does not exist');
  }
}

function formatSeasonId(seasonId: string): SeasonsAttributes['seasonId'] {
  const formattedId = Number(seasonId);
  if (isNaN(formattedId)) {
    throw new BadRequestError('Invalid season id format');
  }
  return formattedId;
}

function isSeasonIdValid(seasonId: string | number): boolean {
  if (Number.isNaN(Number(seasonId))) {
    return false;
  }
  return true;
}

async function doesSeasonIdExist(seasonId: number): Promise<boolean> {
  return await seasonService.doesSeasonExist(seasonId);
}

export default seasonHelper;
