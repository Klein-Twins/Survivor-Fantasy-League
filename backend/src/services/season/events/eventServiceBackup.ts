import { models } from '../../../config/db';
import { ProcessSurvivorEliminationRequestData } from '../../../controllers/events/survivorEliminationController';
import { EpisodeSurveyAttributes } from '../../../models/surveyAndPick/EpisodeSurvey';
import {
  EventType,
  PicksAttributes,
} from '../../../models/surveyAndPick/picks/Picks';
import { PickSolutionAttributes } from '../../../models/surveyAndPick/picks/PickSolutions';
import { SurveyAttributes } from '../../../models/surveyAndPick/Survey';
import { SurveyPicksAttributes } from '../../../models/surveyAndPick/SurveyPicks';
import pickSolutionRepository from '../../../repositories/league/survey/pick/pickSolutionRepository';
import { ForbiddenError, NotFoundError } from '../../../utils/errors/errors';
import episodeSurveyService from '../../league/survey/episodeSurveyService';
import pickFulfillmentService from '../../league/survey/pickFullfillment/pickFulfillmentService';
import episodeService from '../episodeService';
// import seasonEliminationService from '../seasonEliminationService';

const eventService = {
  processSurvivorElimination,
};

async function processSurvivorElimination(
  eventRequest: ProcessSurvivorEliminationRequestData
) {
  const { episodeId, survivorEliminations } = eventRequest;

  const episode = await episodeService.getEpisode('episodeId', episodeId);

  const episodeAirDate = new Date(episode.airDate);
  const hasEpisodeAired = episodeAirDate <= new Date(Date.now());
  if (!hasEpisodeAired) {
    throw new ForbiddenError(
      `Episode ${episodeId} (season ${episode.seasonId}: number: ${episode.number}) has not aired yet. Cannot process eliminations.`
    );
  }

  // const eliminationsRecorded =
  //   await seasonEliminationService.eliminateSurvivors(
  //     survivorEliminations,
  //     episodeId
  //   );

  const event = EventType.SurvivorElimination;
  const pickOfEvent = (await models.Picks.findAll({
    where: {
      eventType: EventType.SurvivorElimination,
    },
    include: [
      {
        model: models.SurveyPicks,
        required: true,
        as: 'surveyPicks',
        include: [
          {
            model: models.Survey,
            required: true,
            as: 'survey',
            include: [
              {
                model: models.EpisodeSurvey,
                as: 'episodeSurvey',
                required: true,
                where: {
                  episodeId: episodeId,
                },
              },
            ],
          },
        ],
      },
    ],
  })) as unknown as (PicksAttributes & {
    surveyPicks: (SurveyPicksAttributes & {
      survey: SurveyAttributes & {
        episodeSurvey: EpisodeSurveyAttributes[];
      };
    })[];
  })[];

  const solutions: {
    solution: PickSolutionAttributes['solution'];
    rank: PickSolutionAttributes['rank'];
  }[] = [];
  // for (const [key, value] of eliminationsRecorded.entries()) {
  //   const solution = {
  //     solution: key,
  //     rank: solutions.length + 1,
  //   };
  //   solutions.push(solution);
  // }

  await pickFulfillmentService.fulfillPickSolution(
    pickOfEvent[0].pickId,
    pickOfEvent[0].surveyPicks[0].survey.episodeSurvey[0].episodeSurveyId,
    episodeId,
    solutions
  );

  // return eliminationsRecorded;
}

export default eventService;
