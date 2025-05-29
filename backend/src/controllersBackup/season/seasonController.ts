import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import {
  GetSeasonsResponse,
  GetSeasonsResponseData,
} from '../../generated-api';
import { NotImplementedError } from '../../utils/errors/errors';
import { container } from 'tsyringe';
import { SeasonService } from '../../services/season/SeasonService';
import { Season } from '../../domain/season/Season';

const upload = multer({ storage: multer.memoryStorage() });

const seasonController = {
  getSeasons,
  createSeason: [upload.single('seasonLogo'), createSeason],
};

async function createSeason(req: Request, res: Response, next: NextFunction) {
  try {
    throw new NotImplementedError('Not implemented');
    /*
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
    */
  } catch (error) {
    next(error);
  }
}

async function getSeasons(req: Request, res: Response, next: NextFunction) {
  try {
    const seasonService = container.resolve(SeasonService);
    const seasons: Season[] = await seasonService.fetchAllSeasons();
    const responseData: GetSeasonsResponseData = {
      seasons: seasons.map((season) => season.toDTO()),
    };
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
