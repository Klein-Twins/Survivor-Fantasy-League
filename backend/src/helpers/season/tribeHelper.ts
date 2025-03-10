import {
  Color,
  CreateTribeRequestBody,
  Episode,
  Tribe,
} from '../../generated-api';
import { TribeAttributes } from '../../models/season/Tribes';
import episodeRepository from '../../repositories/seasons/episodeRepository';
import episodeService from '../../services/season/episodeService';
import { BadRequestError } from '../../utils/errors/errors';
import episodeHelper from './episodeHelper';
import seasonHelper from './seasonHelper';

const tribeHelper = {
  buildTribe,
  validateAndFormatCreateTribeRequest,
};

async function buildTribe(tribeAttributes: TribeAttributes): Promise<Tribe> {
  const episode: Episode = await episodeRepository.getEpisodeByEpisodeId(
    tribeAttributes.episodeStarted
  );

  return {
    seasonId: tribeAttributes.seasonId.toString(),
    id: tribeAttributes.id,
    name: tribeAttributes.name,
    color: {
      color: tribeAttributes.tribeColor,
      hex: tribeAttributes.tribeHexColor,
    },
    isMergeTribe: tribeAttributes.mergeTribe,
    episodeStarted: episode,
    imageUrl: '',
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
  if (!color || !color.hex || !color.color || color.color.trim().length === 0) {
    throw new BadRequestError('Tribe color is required');
  }
  //Color must be hex
  if (!/^#[0-9A-F]{6}$/i.test(color.hex)) {
    throw new BadRequestError('Tribe color must be a hex color');
  }
  if (!/^[a-zA-Z ]+$/.test(color.color)) {
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
