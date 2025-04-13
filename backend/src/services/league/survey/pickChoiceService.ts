import { models } from '../../../config/db';
import logger from '../../../config/logger';
import { PlayerChoices } from '../../../generated-api';
import { PickSubmissionAttributes } from '../../../models/league/PickSubmission';
import { PicksAttributes } from '../../../models/surveyAndPick/picks/Picks';

const pickChoiceService = {
  getPickChoices,
};

async function getPickChoices(
  pickId: PicksAttributes['pickId'],
  submissionId: PickSubmissionAttributes['pickId']
) {
  const pickPlayerSelections = await models.PickSubmissions.findAll({
    where: {
      pickId: pickId,
      surveySubmissionId: submissionId,
    },
  });

  if (!pickPlayerSelections || pickPlayerSelections.length === 0) {
    logger.debug(
      `No choices found for pickId: ${pickId} and submissionId: ${submissionId}`
    );
  }

  const pickChoices: PlayerChoices = [];
  for (const playerSelection of pickPlayerSelections) {
    const playerChoice = {
      playerChoice: playerSelection.playerChoice,
      rank: playerSelection.rank,
    };
    pickChoices.push(playerChoice);
  }

  return pickChoices;
}

export default pickChoiceService;
