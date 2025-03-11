import { models } from '../../../../config/db';
import {
  BinaryOptionsEnum,
  Pick,
  PickOptionTypeEnum,
  PickWithPlayerChoice,
} from '../../../../generated-api';
import picksHelper from '../../../../helpers/league/surveys/picks/picksHelper';
import { PickOptionsAttributes } from '../../../../models/surveysAndPicks/picks/PickOptions';
import { PicksAttributes } from '../../../../models/surveysAndPicks/picks/Picks';
import { SurveyAttributes } from '../../../../models/surveysAndPicks/Survey';
import { SurveyPicksAttributes } from '../../../../models/surveysAndPicks/SurveyPicks';
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
};

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

async function validatePickChoice(
  pickChoice: PickWithPlayerChoice
): Promise<boolean> {
  if (pickChoice.pick.pickOptionType === PickOptionTypeEnum.Binary) {
    if (
      pickChoice.playerChoice !== BinaryOptionsEnum.True &&
      pickChoice.playerChoice !== BinaryOptionsEnum.False
    ) {
      return false;
    }
    return true;
  } else if (pickChoice.pick.pickOptionType === PickOptionTypeEnum.Color) {
    const PickOptionsAttributes: PickOptionsAttributes | null =
      await models.PickOptions.findOne({
        where: { choice: pickChoice.playerChoice as string },
      });
    return !!PickOptionsAttributes;
  } else if (pickChoice.pick.pickOptionType === PickOptionTypeEnum.Survivor) {
    //TODO, make sure survivor is not eliminated and is on the season
    const survivor = await models.Survivors.findOne({
      where: { survivorId: pickChoice.playerChoice as string },
    });
    return !!survivor;
  } else if (pickChoice.pick.pickOptionType === PickOptionTypeEnum.Tribe) {
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
