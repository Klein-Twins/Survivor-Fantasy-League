import { ParsedQs } from 'qs';
import { BadRequestError } from '../../utils/errors/errors';
import seasonHelper from '../season/seasonHelper';
import { SeasonsAttributes } from '../../models/season/Seasons';
import { SurvivorsAttributes } from '../../models/survivors/Survivors';
import { SurvivorDetailsOnSeasonAttributes } from '../../models/survivors/SurvivorDetailsOnSeason';
import { CreateSurvivorRequestBody, Survivor } from '../../generated-api';
import { models } from '../../config/db';

const survivorHelper = {
  validateAndFormatGetSurvivorsRequest,
  buildSurvivor,
  validateName,
  validateJob,
  validateDescription,
  validateFromState,
  validateFromCountry,
  validateAge,
  validateAndFormatCreateSurvivorRequest,
  doesSurvivorExist,
};

function buildSurvivor(
  survivorAttributes: SurvivorsAttributes,
  survivorDetailAttributes: SurvivorDetailsOnSeasonAttributes
): Survivor {
  return {
    id: survivorAttributes.id,
    firstName: survivorAttributes.firstName,
    lastName: survivorAttributes.lastName,
    fromCity: survivorAttributes.fromCity,
    fromState: survivorAttributes.fromState,
    fromCountry: survivorAttributes.fromCountry,
    nickName: survivorAttributes.nickName,
    seasonId: survivorDetailAttributes.seasonId,
    age: survivorDetailAttributes.age,
    description: survivorDetailAttributes.description,
    job: survivorDetailAttributes.job,
  };
}

async function doesSurvivorExist(
  firstName: string,
  lastName: string
): Promise<boolean> {
  const survivorAttributes: SurvivorsAttributes | null =
    await models.Survivors.findOne({
      where: {
        firstName: firstName,
        lastName: lastName,
      },
    });

  return !!survivorAttributes;
}

async function validateAndFormatCreateSurvivorRequest(
  reqData: CreateSurvivorRequestBody
): Promise<CreateSurvivorRequestBody> {
  await validateCreateSurvivorRequest(reqData);
  const formattedData: CreateSurvivorRequestBody =
    formatCreateSurvivorRequest(reqData);
  return formattedData;
}

function formatCreateSurvivorRequest(
  reqData: CreateSurvivorRequestBody
): CreateSurvivorRequestBody {
  return {
    firstName: reqData.firstName.trim(),
    lastName: reqData.lastName.trim(),
    nickname: reqData.nickname.trim(),
    job: reqData.job.trim(),
    description: reqData.description.trim(),
    fromCountry: reqData.fromCountry.trim(),
    fromState: reqData.fromState.trim(),
    age: reqData.age,
    seasonId: reqData.seasonId,
  };
}

async function validateCreateSurvivorRequest(
  reqData: CreateSurvivorRequestBody
): Promise<void> {
  await seasonHelper.validateSeasonId(reqData.seasonId.toString());
  validateName(reqData.firstName);
  validateName(reqData.lastName);
  validateName(reqData.nickname);
  validateJob(reqData.job);
  validateDescription(reqData.description);
  validateFromCountry(reqData.fromCountry);
  validateFromState(reqData.fromState);
  validateAge(reqData.age);
}

function validateFromCountry(fromCountry: string): void {
  if (!fromCountry || fromCountry.trim().length === 0) {
    throw new BadRequestError('Country is required');
  }
  if (fromCountry.length > 255) {
    throw new BadRequestError('Country is too long');
  }
}

function validateFromState(fromState: string): void {
  if (!fromState || fromState.trim().length === 0) {
    throw new BadRequestError('State is required');
  }
  if (fromState.length > 255) {
    throw new BadRequestError('State is too long');
  }
}

function validateAge(age: number): void {
  if (!age) {
    throw new BadRequestError('Age is required');
  }
  if (age < 16) {
    throw new BadRequestError('Age must be at least 16');
  }
  if (isNaN(age)) {
    throw new BadRequestError('Age must be a number');
  }
}

function validateDescription(description: string): void {
  if (!description || description.trim().length === 0) {
    throw new BadRequestError('Description is required');
  }
  if (description.length > 255) {
    throw new BadRequestError('Description is too long');
  }
}

function validateJob(job: string): void {
  if (!job || job.trim().length === 0) {
    throw new BadRequestError('Job is required');
  }
  if (job.length > 255) {
    throw new BadRequestError('Job is too long');
  }
}

function validateName(name: string): void {
  if (!name || name.trim.length === 0) {
    throw new BadRequestError('Name is required');
  }
  if (name.length > 255) {
    throw new BadRequestError('Name is too long');
  }
  if (name.length < 2) {
    throw new BadRequestError('Name is too short');
  }
  if (name.match(/[^a-zA-Z\s]/)) {
    throw new BadRequestError('Name must only contain letters');
  }
}

function validateAndFormatGetSurvivorsRequest(
  seasonIds: ParsedQs[string]
): SeasonsAttributes['seasonId'][] {
  if (!seasonIds) {
    throw new BadRequestError('Season ID is required');
  }

  const seasonIdArray: string[] = Array.isArray(seasonIds)
    ? seasonIds.map((id) => id.toString())
    : [seasonIds.toString()];

  const validSeasonIds: number[] = seasonIdArray.map((seasonId) => {
    seasonHelper.validateSeasonId(seasonId);
    return seasonHelper.formatSeasonId(seasonId);
  });

  return validSeasonIds;
}

export default survivorHelper;
