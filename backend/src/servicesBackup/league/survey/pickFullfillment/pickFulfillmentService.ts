import sequelize from '../../../../config/db';
import { EpisodeAttributes } from '../../../../models/season/Episodes';
import { EpisodeSurveyAttributes } from '../../../../models/surveyAndPick/EpisodeSurvey';
import { PicksAttributes } from '../../../../models/surveyAndPick/picks/Picks';
import { PickSolutionAttributes } from '../../../../models/surveyAndPick/picks/PickSolutions';
import pickSolutionRepository from '../../../../repositoriesBackup/league/survey/pick/pickSolutionRepository';
import pickSubmissionRepository from '../../../../repositoriesBackup/league/survey/pick/pickSubmissionRespository';

const pickFulfillmentService = {
  fulfillPickSolution,
};

async function fulfillPickSolution(
  pickId: PicksAttributes['pickId'],
  episodeSurveyId: EpisodeSurveyAttributes['episodeSurveyId'],
  episodeId: EpisodeAttributes['id'],
  solutions: {
    solution: PickSolutionAttributes['solution'];
    rank: PickSolutionAttributes['rank'];
  }[]
): Promise<void> {
  const foundPickSolutions = await pickSolutionRepository.getPickSolutions(
    pickId,
    episodeSurveyId
  );
  if (foundPickSolutions.length > 0) {
    throw new Error('Pick has already been resolved!');
  }

  const transaction = await sequelize.transaction();
  const pickSolutionsAttributes = await pickSolutionRepository.setPickSolutions(
    pickId,
    episodeSurveyId,
    episodeId,
    solutions,
    transaction
  );

  await pickSubmissionRepository.fulfillPickSubmission(
    pickId,
    episodeSurveyId,
    transaction
  );

  await transaction.commit();
}

export default pickFulfillmentService;
