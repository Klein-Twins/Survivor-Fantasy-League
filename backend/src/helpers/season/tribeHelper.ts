import { Color, CreateTribeRequestBody } from '../../generated-api';
import { BadRequestError } from '../../utils/errors/errors';
import seasonHelper from './seasonHelper';

const tribeHelper = {
  validateAndFormatCreateTribeRequest,
};

async function validateAndFormatCreateTribeRequest(
  req: CreateTribeRequestBody
): Promise<CreateTribeRequestBody> {
  await validateCreateTribeRequest(req);
  return formatCreateTribeRequest(req);
}

async function validateCreateTribeRequest(
  req: CreateTribeRequestBody
): Promise<void> {
  validateTribeName(req.name);
  await seasonHelper.validateSeasonId(req.seasonId.toString());
  validateIsMergeTribe(req.isMergeTribe);
  validateTribeColor(req.color);
}

function validateTribeName(name: string) {
  if (!name || name.trim().length === 0) {
    throw new BadRequestError('Tribe name is required');
  }
  if (!/^[a-zA-Z]+$/.test(name)) {
    throw new BadRequestError('Tribe name must be alpha only');
  }
}

function validateIsMergeTribe(isMergeTribe: boolean | string) {
  if (isMergeTribe === undefined) {
    throw new BadRequestError('isMergeTribe is required');
  }
  if (typeof isMergeTribe === 'string') {
    if (isMergeTribe.toLowerCase() === 'true') {
      isMergeTribe = true;
    } else if (isMergeTribe.toLowerCase() === 'false') {
      isMergeTribe = false;
    } else {
      throw new BadRequestError('isMergeTribe must be a boolean');
    }
  }
  if (typeof isMergeTribe !== 'boolean') {
    throw new BadRequestError('isMergeTribe must be a boolean');
  }
}

function validateTribeColor(color: Color) {
  if (!color || !color.hex || !color.name || color.name.trim().length === 0) {
    throw new BadRequestError('Tribe color is required');
  }
  //Color must be hex
  if (!/^#[0-9A-F]{6}$/i.test(color.hex)) {
    throw new BadRequestError('Tribe color must be a hex color');
  }
  if (!/^[a-zA-Z ]+$/.test(color.name)) {
    throw new BadRequestError('Tribe color must be alpha with spaces');
  }
}

function formatCreateTribeRequest(
  req: CreateTribeRequestBody
): CreateTribeRequestBody {
  return {
    name: req.name.trim(),
    seasonId: req.seasonId,
    isMergeTribe: req.isMergeTribe,
    episodeStarted: req.episodeStarted,
    color: req.color,
  };
}

export default tribeHelper;
