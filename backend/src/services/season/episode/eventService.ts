import { EliminatedSurvivors } from '../../../data/foundation/data/ssn/dataTypes';
import { Season } from '../../../domain/season/season';
import { InternalServerError } from '../../../utils/errors/errors';
import seasonEliminationService from '../seasonEliminationService';
import tribeMemberService from '../tribeMemberService';

const eventService = {};

async function processSurvivorEliminationEvent(
  event: EliminatedSurvivors,
  season: Season
) {
  for (const eliminatedSurvivor of event) {
    const survivor = season.getSurvivorById(eliminatedSurvivor.survivorId);

    //await seasonEliminationService.eliminateSurvivors();
  }
}

export default eventService;
