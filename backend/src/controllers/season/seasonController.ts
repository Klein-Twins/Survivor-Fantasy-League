import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import {
  CreateSeasonRequestBody,
  CreateSeasonResponse,
  CreateSeasonResponseData,
  GetSeasonsResponse,
  GetSeasonsResponseData,
} from '../../generated-api';
import seasonService from '../../services/season/seasonService';
import { BadRequestError } from '../../utils/errors/errors';
import seasonHelper from '../../helpers/season/seasonHelper';
import s3Service from '../../services/image/s3Service';

const upload = multer({ storage: multer.memoryStorage() });

const seasonController = {
  getSeasons,
  createSeason: [upload.single('seasonLogo'), createSeason],
};

async function createSeason(req: Request, res: Response, next: NextFunction) {
  try {
    const requestBody: CreateSeasonRequestBody = req.body;
    await seasonHelper.validateCreateSeasonRequest(requestBody);
    const seasonLogo = req.file;

    if (!seasonLogo) {
      throw new BadRequestError('Season logo is required');
    }

    const responseData: CreateSeasonResponseData = {
      season: await seasonService.createSeason(requestBody),
    };

    await s3Service.uploadSeasonLogo(
      requestBody.seasonNumber.toString(),
      seasonLogo
    );
    const response: CreateSeasonResponse = {
      responseData,
      success: true,
      message: 'Season created successfully',
      statusCode: 200,
    };
    res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
}

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
