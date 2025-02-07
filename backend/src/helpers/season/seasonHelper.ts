import { Season } from '../../generated-api';
import { SeasonsAttributes } from '../../models/season/Seasons';
import seasonService from '../../services/season/seasonService';
import { BadRequestError, NotFoundError } from '../../utils/errors/errors';

const seasonHelper = {
  validateSeasonId,
  buildSeason,
  formatSeasonId,
};

function buildSeason(seasonAttributes: SeasonsAttributes): Season {
  return {
    id: seasonAttributes.seasonId,
    name: seasonAttributes.name,
    startDate: seasonAttributes.startDate.toString(),
    endDate: seasonAttributes.endDate.toString(),
    location: seasonAttributes.location,
    theme: seasonAttributes.theme,
  };
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
