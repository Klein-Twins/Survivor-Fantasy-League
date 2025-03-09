import { Transaction } from 'sequelize';
import {
  CreateSeasonRequestBody,
  Episode,
  GetSeasonsResponseData,
  Season,
} from '../../generated-api';
import { SeasonsAttributes } from '../../models/season/Seasons';
import seasonRepository from '../../repositories/seasons/seasonRepository';
import { NotFoundError } from '../../utils/errors/errors';
import { sequelize } from '../../config/db';
import episodeService from './episodeService';
import seasonHelper from '../../helpers/season/seasonHelper';

const seasonService = {
  doesSeasonExist,
  getSeasonBySeasonId,
  getAllSeasons,
  createSeason,
};

async function doesSeasonExist(
  seasonId: SeasonsAttributes['seasonId']
): Promise<boolean> {
  try {
    await seasonRepository.getSeason(seasonId);
    return true;
  } catch (error) {
    if (error instanceof NotFoundError) {
      return false;
    }
    throw error;
  }
}

async function getSeasonBySeasonId(seasonId: number) {
  return await seasonRepository.getSeason(seasonId);
}

async function getAllSeasons(): Promise<GetSeasonsResponseData> {
  return { seasons: await seasonRepository.getAllSeasons() };
}

async function createSeason(
  seasonData: CreateSeasonRequestBody
): Promise<Season> {
  const transaction: Transaction = await sequelize.transaction();

  try {
    const newSeasonAttributes = await seasonRepository.createSeason(
      seasonData,
      transaction
    );

    const episodes: Episode[] = await episodeService.createEpisodesForNewSeason(
      seasonData.seasonNumber,
      new Date(seasonData.startDate),
      new Date(seasonData.endDate),
      transaction
    );

    await transaction.commit();
    return seasonHelper.buildSeason(newSeasonAttributes, [], [], episodes);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export default seasonService;
