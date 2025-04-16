import { Op, Transaction } from 'sequelize';
import { models } from '../../../../config/db';
import { EpisodeSurveyAttributes } from '../../../../models/surveyAndPick/EpisodeSurvey';
import { PicksAttributes } from '../../../../models/surveyAndPick/picks/Picks';
import { PickSubmissionStatus } from '../../../../models/league/PickSubmission';
import pickSolutionRepository from './pickSolutionRepository';

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
    })
  ).map((leagueSurveyAttributes) => leagueSurveyAttributes.leagueSurveyId);

  const surveySubmissionIds = (
    await models.SurveySubmissions.findAll({
      where: {
        leagueSurveyId: {
          [Op.in]: affectedLeagueSurveyIds,
        },
      },
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
  });

  for (const pickSubmissionToUpdate of pickSubmissionsToUpdate) {
    await models.PickSubmissions.update(
      {
        status:
          pickSubmissionToUpdate.playerChoice in pickSolutionsIds
            ? PickSubmissionStatus.CORRECT
            : PickSubmissionStatus.INCORRECT,
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
