import { NextFunction, Request, Response } from 'express';
import {
  CreateSurvivorRequestBody,
  CreateSurvivorResponse,
  CreateSurvivorResponseData,
  GetSurvivorsResponse,
  GetSurvivorsResponseData,
  Survivor,
} from '../../generated-api';
import survivorService from '../../services/survivor/survivorService';
import survivorHelper from '../../helpers/survivor/survivorHelper';
import { SeasonsAttributes } from '../../models/season/Seasons';
import logger from '../../config/logger';

const survivorController = {
  getSurvivors,
  createSurvivor,
};

async function createSurvivor(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  let response: CreateSurvivorResponse;
  try {
    const reqBody: CreateSurvivorRequestBody = req.body;
    const survivorData =
      await survivorHelper.validateAndFormatCreateSurvivorRequest(reqBody);
    const survivor: Survivor = await survivorService.createSurvivor(
      survivorData
    );
    const responseData: CreateSurvivorResponseData = {
      survivor: survivor,
    };
    response = {
      statusCode: 201,
      message: 'Successfully created survivor',
      success: true,
      responseData,
    };
    res.status(201).json(response);
  } catch (error) {
    logger.debug('Error in creating survivor: ', error);
    next(error);
  }
}

async function getSurvivors(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  let response: GetSurvivorsResponse;
  try {
    const seasonId = req.query.seasonId;
    const seasonIds: SeasonsAttributes['seasonId'][] =
      survivorHelper.validateAndFormatGetSurvivorsRequest(seasonId);

    const responseData: GetSurvivorsResponseData = {
      survivors: await survivorService.getSurvivorsBySeason(seasonIds),
    };
    response = {
      statusCode: 200,
      message: 'Successfully retrieved survivors',
      responseData: responseData,
      success: true,
    };
    res.status(200).json(response);
    return;
  } catch (error) {
    next(error);
  }
}

export default survivorController;
