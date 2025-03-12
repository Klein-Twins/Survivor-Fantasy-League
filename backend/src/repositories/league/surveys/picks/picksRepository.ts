import { Transaction } from 'sequelize';
import { models } from '../../../../config/db';
import {
  BinaryOptionsEnum,
  Pick,
  PickOptionTypeEnum,
  PickSelection,
} from '../../../../generated-api';
import picksHelper from '../../../../helpers/league/surveys/picks/picksHelper';
import { PickSubmissionAttributes } from '../../../../models/league/PickSubmission';
import { SurveySubmissionAttributes } from '../../../../models/league/SurveySubmissions';
import { PickOptionsAttributes } from '../../../../models/surveyAndPick/picks/PickOptions';
import { PicksAttributes } from '../../../../models/surveyAndPick/picks/Picks';
import { SurveyAttributes } from '../../../../models/surveyAndPick/Survey';
import { SurveyPicksAttributes } from '../../../../models/surveyAndPick/SurveyPicks';
import picksService from '../../../../services/league/surveys/picks/picksService';
import {
  BadRequestError,
  NotFoundError,
} from '../../../../utils/errors/errors';
import pickPointsRepository from './pickPointsRepository';
import pickOptionsRepository from './picksOptionsRepository';

const picksRepository = {
  getPick,
  validatePickInSurvey,
  validatePickChoice,
  submitPicks,
  getPicksForSurveyId,
  getPickSelections,
};

async function getPickSelections(
  surveySubmissionId: SurveySubmissionAttributes['surveySubmissionId']
): Promise<PickSelection[]> {
  const pickSubmissionsAttributes: PickSubmissionAttributes[] =
    await models.PickSubmissions.findAll({
      where: {
        surveySubmissionId,
      },
    });

  if (pickSubmissionsAttributes.length === 0) {
    throw new NotFoundError(
      `No picks found for surveySubmissionId ${surveySubmissionId}`
    );
  }

  let pickSelections: PickSelection[] = [];

  for (const pickSubmissionAttributes of pickSubmissionsAttributes) {
    const pickId = pickSubmissionAttributes.pickId;
    const playerChoice = pickSubmissionAttributes.playerChoice;
    pickSelections.push({ pickId, playerChoice });
  }

  return pickSelections;
}

async function getPicksForSurveyId(
  surveyId: SurveyAttributes['surveyId']
): Promise<Pick[]> {
  const picksAttributes: SurveyPicksAttributes[] =
    await models.SurveyPicks.findAll({
      where: {
        surveyId: surveyId,
      },
    });

  if (picksAttributes.length === 0) {
    throw new NotFoundError(`No picks found for surveyId: ${surveyId}`);
  }

  let picks: Pick[] = [];
  for (const pickAttributes of picksAttributes) {
    const pick: Pick = await picksService.getPick(pickAttributes.pickId);
    picks.push(pick);
  }

  return picks;
}

async function submitPicks(
  surveySubmissionId: SurveySubmissionAttributes['surveySubmissionId'],
  pickAndChoices: PickSelection[],
  transaction?: Transaction
): Promise<PickSubmissionAttributes[]> {
  let t = transaction;
  if (!t) {
    t = await models.sequelize.transaction();
  }
  try {
    let pickSubmissions: PickSubmissionAttributes[] = [];
    for (const pickAndChoice of pickAndChoices) {
      const pickSubmission: PickSubmissionAttributes =
        await models.PickSubmissions.create(
          {
            surveySubmissionId,
            pickId: pickAndChoice.pickId,
            playerChoice: pickAndChoice.playerChoice,
            pointsEarned: null,
          },
          { transaction: t }
        );
    }
    return pickSubmissions;
  } catch (error) {
    if (!transaction && t) {
      t.rollback();
    }
    throw error;
  }
}

async function getPick(pickId: PicksAttributes['pickId']): Promise<Pick> {
  picksHelper.validatePickId(pickId);
  const pickAttributes = await models.Picks.findOne({
    where: {
      pickId,
    },
  });

  if (!pickAttributes) {
    throw new NotFoundError(`Pick not found for pickId: ${pickId}`);
  }

  const pickPoints: number = await pickPointsRepository.getPickPoints(pickId);

  //TODO - Change 47 hardcoded value
  const pickOptions = await pickOptionsRepository.getPickOptions(
    pickAttributes.type,
    47
  );

  return picksHelper.buildPick(pickAttributes, pickOptions, pickPoints);
}

async function validatePickInSurvey(
  surveyId: SurveyAttributes['surveyId'],
  pickIds: PicksAttributes['pickId']
): Promise<boolean> {
  const surveyPicks: SurveyPicksAttributes | null =
    await models.SurveyPicks.findOne({
      where: {
        surveyId,
        pickId: pickIds,
      },
    });
  return !!surveyPicks;
}

async function validatePickChoice(pickChoice: PickSelection): Promise<boolean> {
  const pickAttributes: PicksAttributes | null = await models.Picks.findOne({
    where: { pickId: pickChoice.pickId },
  });
  if (!pickAttributes) {
    return false;
  }
  const pickOptionType = pickAttributes.type;

  if (pickOptionType === PickOptionTypeEnum.Binary) {
    if (
      pickChoice.playerChoice !== BinaryOptionsEnum.True &&
      pickChoice.playerChoice !== BinaryOptionsEnum.False
    ) {
      return false;
    }
    return true;
  } else if (pickOptionType === PickOptionTypeEnum.Color) {
    const PickOptionsAttributes: PickOptionsAttributes | null =
      await models.PickOptions.findOne({
        where: { choice: pickChoice.playerChoice as string },
      });
    return !!PickOptionsAttributes;
  } else if (pickOptionType === PickOptionTypeEnum.Survivor) {
    //TODO, make sure survivor is not eliminated and is on the season
    const survivor = await models.Survivors.findOne({
      where: { survivorId: pickChoice.playerChoice as string },
    });
    return !!survivor;
  } else if (pickOptionType === PickOptionTypeEnum.Tribe) {
    //TODO: Make sure tribe is on the season and is still in the game
    const tribe = await models.Tribe.findOne({
      where: { id: pickChoice.playerChoice as string },
    });
    return !!tribe;
  } else {
    return false;
  }
}

export default picksRepository;
