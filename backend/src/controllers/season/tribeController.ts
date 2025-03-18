import { NextFunction, Request, Response } from 'express';
import {
  CreateTribeRequestBody,
  CreateTribeResponse,
  CreateTribeResponseData,
  Tribe,
} from '../../generated-api';
import tribeHelper from '../../helpers/season/tribeHelper';
import tribeService from '../../services/season/tribeService';
import { TribeAttributes } from '../../models/season/Tribes';

const tribeController = {
  createTribe,
};

async function createTribe(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  let response: CreateTribeResponse;
  try {
    const reqBody = req.body;
    const tribeData: CreateTribeRequestBody =
      await tribeHelper.validateAndFormatCreateTribeRequest(reqBody);
    const tribe: Tribe = await tribeService.createTribe(tribeData);
    const responseData: CreateTribeResponseData = {
      tribe,
    };
    response = {
      success: true,
      message: 'Tribe created successfully',
      statusCode: 201,
      responseData,
    };
    res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
}

function buildTribe(tribeAttributes: TribeAttributes): Tribe {
  return {
    seasonId: tribeAttributes.seasonId.toString(),
    id: tribeAttributes.id,
    name: tribeAttributes.name,
    color: {
      name: tribeAttributes.tribeColor,
      hex: tribeAttributes.tribeHexColor,
    },
    isMergeTribe: tribeAttributes.mergeTribe,
    episodeStarted: tribeAttributes.episodeStarted.toString(),
    //TODO: Implement this for tribe history
    currentSurvivorIds: [],
  };
}

export default tribeController;
