import { UUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';
import {
  ProcessEliminationRequestBody,
  SurvivorElimination,
} from '../../generated-api';
import { BadRequestError } from '../../utils/errors/errors';

import validator from 'validator';
import eventService from '../../services/season/events/eventService';

const survivorEliminationController = {
  processSurvivorElimination,
};

interface ProcessSurvivorEliminationPathParams {
  episodeId: UUID;
}

export type ProcessSurvivorEliminationRequestData =
  ProcessEliminationRequestBody & ProcessSurvivorEliminationPathParams;

async function processSurvivorElimination(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const requestData = validateProcessSurvivorEliminationRequest(req);
    const eliminationsRecorded = await eventService.processSurvivorElimination(
      requestData
    );
    res.status(200).json({
      message: 'Survivor eliminations processed successfully',
      eliminationsRecorded,
    });
  } catch (error) {
    console.error('Error processing survivor elimination data:', error);
    next(error);
  }
}

function validateProcessSurvivorEliminationRequest(
  req: Request
): ProcessSurvivorEliminationRequestData {
  const episodeId = req.params.episodeId as UUID;
  const survivorEliminations = req.body
    .survivorEliminations as SurvivorElimination[];

  if (!episodeId) {
    throw new BadRequestError('Missing episodeId in request parameters');
  }
  if (!validator.isUUID(episodeId)) {
    throw new BadRequestError('Invalid episodeId');
  }

  if (!survivorEliminations) {
    throw new BadRequestError('Missing survivorEliminations in request body');
  }
  if (!Array.isArray(survivorEliminations)) {
    throw new BadRequestError('survivorEliminations must be an array');
  }
  if (survivorEliminations.length === 0) {
    throw new BadRequestError('survivorEliminations array cannot be empty');
  }
  for (const elimination of survivorEliminations) {
    if (!elimination) {
      throw new BadRequestError('Invalid survivorElimination object');
    }
    if (!elimination.survivorId) {
      throw new BadRequestError(
        'Missing survivorId in survivorElimination object'
      );
    }
    if (!validator.isUUID(elimination.survivorId)) {
      throw new BadRequestError(
        'Invalid survivorId in survivorElimination object'
      );
    }
    if (!elimination.rank) {
      throw new BadRequestError('Missing rank in survivorElimination object');
    }
    if (!validator.isInt(elimination.rank.toString(), { min: 1 })) {
      throw new BadRequestError('Invalid rank in survivorElimination object');
    }
  }

  return {
    episodeId,
    survivorEliminations,
  };
}

export default survivorEliminationController;
