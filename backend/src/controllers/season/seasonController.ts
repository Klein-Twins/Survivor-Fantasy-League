import { NextFunction, Request, Response } from 'express';
import {
  GetSeasonsResponse,
  GetSeasonsResponseData,
} from '../../generated-api';
import seasonService from '../../services/season/seasonService';
import { BadRequestError } from '../../utils/errors/errors';

const seasonController = {
  getSeasons,
};

async function getSeasons(req: Request, res: Response, next: NextFunction) {
  try {
    const seasonId = req.params.seasonId;
    if (seasonId && Number.isNaN(Number(seasonId))) {
      throw new BadRequestError('Invalid seasonId');
    }
    let responseData: GetSeasonsResponseData;
    if (seasonId) {
      responseData = {
        seasons: [await seasonService.getSeasonBySeasonId(Number(seasonId))],
      };
    } else {
      responseData = await seasonService.getAllSeasons();
    }
    const response: GetSeasonsResponse = {
      responseData,
      success: true,
      message: 'Operation completed successfully',
      statusCode: 200,
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

export default seasonController;
