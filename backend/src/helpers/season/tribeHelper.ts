import { CreateTribeRequestBody, Tribe } from '../../generated-api';
import { TribeAttributes } from '../../models/season/Tribes';
import { BadRequestError } from '../../utils/errors/errors';
import episodeHelper from './episodeHelper';
import seasonHelper from './seasonHelper';

const tribeHelper = {
  buildTribe,
  validateAndFormatCreateTribeRequest,
};

function buildTribe(tribeAttributes: TribeAttributes): Tribe {
  return {
    id: tribeAttributes.id,
    name: tribeAttributes.name,
    color: tribeAttributes.tribeColor,
    //TODO: Add tribe image
    imageUrl: /* tribeAttributes?.imageUrl || */ '',
  };
}

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
  await episodeHelper.validateEpisodeNumber(req.episodeStarted);
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

function validateIsMergeTribe(isMergeTribe: boolean) {
  if (isMergeTribe === undefined) {
    throw new BadRequestError('isMergeTribe is required');
  }
  if (typeof isMergeTribe !== 'boolean') {
    throw new BadRequestError('isMergeTribe must be a boolean');
  }
}

function validateTribeColor(color: string) {
  if (!color || color.trim().length === 0) {
    throw new BadRequestError('Tribe color is required');
  }
  if (!/^[a-zA-Z]+$/.test(color)) {
    throw new BadRequestError('Tribe color must be alpha only');
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
    color: req.color.trim(),
  };
}

export default tribeHelper;
