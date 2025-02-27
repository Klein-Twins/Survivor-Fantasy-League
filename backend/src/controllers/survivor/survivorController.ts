import { NextFunction, Request, Response } from 'express';
import {
  GetSurvivorsResponse,
  GetSurvivorsResponseData,
} from '../../generated-api';
import survivorService from '../../services/survivor/survivorService';
import survivorHelper from '../../helpers/survivor/survivorHelper';
import { SeasonsAttributes } from '../../models/season/Seasons';

const survivorController = {
  getSurvivors,
};

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
