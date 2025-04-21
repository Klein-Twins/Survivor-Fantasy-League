import { UUID } from 'crypto';
import { models } from '../../../config/db';
import { LeagueAttributes } from '../../../models/league/League';
import { LeagueSurveyForEpisodeAttributes } from '../../../models/league/LeagueSurveysForEpisode';
import { EpisodeSurveyAttributes } from '../../../models/surveyAndPick/EpisodeSurvey';
import { v4 as uuidv4 } from 'uuid';
import { Transaction } from 'sequelize';

const leagueSurveyForEpisodeRepostiory = {
  getLeagueSurveyForEpisode,
  createLeagueSurveyForEpisode,
};

async function getLeagueSurveyForEpisode(
  episodeSurveyId: EpisodeSurveyAttributes['episodeId'],
  leagueId: LeagueAttributes['leagueId']
): Promise<LeagueSurveyForEpisodeAttributes> {
  let leagueSurveyForEpisodeAttributes =
    await models.LeagueSurveyForEpisode.findOne({
      where: {
        episodeSurveyId,
        leagueId,
      },
    });
  if (!leagueSurveyForEpisodeAttributes) {
    const leagueSurveyId: UUID = uuidv4() as UUID;
    leagueSurveyForEpisodeAttributes =
      await models.LeagueSurveyForEpisode.create({
        leagueSurveyId,
        episodeSurveyId,
        leagueId,
      });
  }
  return leagueSurveyForEpisodeAttributes;
}

async function createLeagueSurveyForEpisode(
  episodeSurveyId: EpisodeSurveyAttributes['episodeId'],
  leagueId: LeagueAttributes['leagueId'],
  transaction?: Transaction
): Promise<LeagueSurveyForEpisodeAttributes> {
  let t = transaction;
  if (!transaction) {
    t = await models.sequelize.transaction();
  }
  try {
    const leagueSurveyId: UUID = uuidv4() as UUID;
    const leagueSurveyForEpisodeAttributes =
      await models.LeagueSurveyForEpisode.create(
        {
          leagueSurveyId,
          episodeSurveyId,
          leagueId,
        },
        { transaction }
      );
    if (!transaction && t) {
      await t.commit;
    }

    return leagueSurveyForEpisodeAttributes;
  } catch (error) {
    if (!transaction && t) {
      await t.rollback();
    }
    throw error;
  }
}

export default leagueSurveyForEpisodeRepostiory;
