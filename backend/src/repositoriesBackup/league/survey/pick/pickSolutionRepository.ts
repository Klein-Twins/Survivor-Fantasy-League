import { Transaction } from 'sequelize';
import { EpisodeAttributes } from '../../../../models/season/Episodes';
import { EpisodeSurveyAttributes } from '../../../../models/surveyAndPick/EpisodeSurvey';
import { PicksAttributes } from '../../../../models/surveyAndPick/picks/Picks';
import { PickSolutionAttributes } from '../../../../models/surveyAndPick/picks/PickSolutions';
import sequelize, { models } from '../../../../config/db';

const pickSolutionRepository = {
  setPickSolutions,
  getPickSolutions,
};

async function setPickSolutions(
  pickId: PicksAttributes['pickId'],
  episodeSurveyId: EpisodeSurveyAttributes['episodeSurveyId'],
  episodeId: EpisodeAttributes['id'],
  solutions: {
    solution: PickSolutionAttributes['solution'];
    rank: PickSolutionAttributes['rank'];
  }[],
  transaction?: Transaction
): Promise<PickSolutionAttributes[]> {
  let t = transaction;
  if (!t) {
    t = await sequelize.transaction();
  }
  try {
    const pickSolutions: PickSolutionAttributes[] = [];
    for (const solution of solutions) {
      const pickSolution = await models.PickSolutions.create(
        {
          pickId,
          episodeSurveyId,
          episodeId,
          solution: solution.solution,
          rank: solution.rank,
        },
        { transaction: t }
      );
      pickSolutions.push(pickSolution);
    }
    if (t && !transaction) {
      await t.commit();
    }
    return pickSolutions;
  } catch (error) {
    if (t && !transaction) {
      await t.rollback();
    }
    throw error;
  }
}

async function getPickSolutions(
  pickId: PicksAttributes['pickId'],
  episodeSurveyId: EpisodeSurveyAttributes['episodeSurveyId'],
  transaction?: Transaction
): Promise<PickSolutionAttributes[]> {
  return await models.PickSolutions.findAll({
    where: {
      pickId,
      episodeSurveyId,
    },
    transaction,
  });
}

export default pickSolutionRepository;
