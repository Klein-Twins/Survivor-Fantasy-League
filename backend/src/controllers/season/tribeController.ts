import { NextFunction, Request, Response } from 'express';
import {
  CreateTribeRequestBody,
  CreateTribeResponse,
  Tribe,
} from '../../generated-api';
import tribeHelper from '../../helpers/season/tribeHelper';
import tribeService from '../../services/season/tribeService';

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
  } catch (error) {
    next(error);
  }
}

export default tribeController;
