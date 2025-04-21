import { NextFunction, Request, Response } from 'express';
import {
  CreateSurvivorRequestBody,
  CreateSurvivorResponse,
  CreateSurvivorResponseData,
  Survivor,
} from '../../generated-api';
import survivorHelper from '../../helpers/survivor/survivorHelper';
import logger from '../../config/logger';
import survivorService from '../../servicesBackup/season/survivorService';

const survivorController = {
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

export default survivorController;
