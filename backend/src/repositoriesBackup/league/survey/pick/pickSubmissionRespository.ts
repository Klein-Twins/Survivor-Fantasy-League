import { Op, Transaction } from 'sequelize';
import { models } from '../../../../config/db';
import { EpisodeSurveyAttributes } from '../../../../models/surveyAndPick/EpisodeSurvey';
import { PicksAttributes } from '../../../../models/surveyAndPick/picks/Picks';
import { PickSubmissionStatus } from '../../../../models/league/PickSubmission';
import pickSolutionRepository from './pickSolutionRepository';
import { UUID } from 'crypto';

const pickSubmissionRepository = {
  fulfillPickSubmission,
};

async function fulfillPickSubmission(
  pickId: PicksAttributes['pickId'],
  episodeSurveyId: EpisodeSurveyAttributes['episodeSurveyId'],
  transaction: Transaction
) {
  const pickSolutionsIds = (
    await pickSolutionRepository.getPickSolutions(
      pickId,
      episodeSurveyId,
      transaction
    )
  ).map((pickSolutions) => pickSolutions.solution);

  const affectedLeagueSurveyIds = (
    await models.LeagueSurveyForEpisode.findAll({
      where: {
        episodeSurveyId: episodeSurveyId,
      },
      transaction,
    })
  ).map((leagueSurveyAttributes) => leagueSurveyAttributes.leagueSurveyId);

  const surveySubmissionIds = (
    await models.SurveySubmissions.findAll({
      where: {
        leagueSurveyId: {
          [Op.in]: affectedLeagueSurveyIds,
        },
      },
      transaction,
    })
  ).map(
    (surveySubmissionAttributes) =>
      surveySubmissionAttributes.surveySubmissionId
  );

  const pickSubmissionsToUpdate = await models.PickSubmissions.findAll({
    where: {
      pickId: pickId,
      surveySubmissionId: {
        [Op.in]: surveySubmissionIds,
      },
      status: PickSubmissionStatus.PENDING,
    },
    transaction,
  });

  for (const pickSubmissionToUpdate of pickSubmissionsToUpdate) {
    const playerChoiceStatus: PickSubmissionStatus = pickSolutionsIds.includes(
      pickSubmissionToUpdate.playerChoice as UUID
    )
      ? PickSubmissionStatus.CORRECT
      : PickSubmissionStatus.INCORRECT;
    await models.PickSubmissions.update(
      {
        status: playerChoiceStatus,
      },
      {
        where: {
          surveySubmissionId: pickSubmissionToUpdate.surveySubmissionId,
          pickId,
        },
        transaction: transaction,
      }
    );
  }
}

export default pickSubmissionRepository;
