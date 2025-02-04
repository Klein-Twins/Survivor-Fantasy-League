import { validate } from 'uuid';
import { BadRequestError } from '../../utils/errors/errors';

const surveyHelper = {
  validateGetSurveyRequest,
};

async function validateGetSurveyRequest(leagueId: string, profileIds: string[], episodeIds: number[]): Promise<void> {
  // Validate leagueId
  if (!leagueId) {
    throw new BadRequestError('Missing leagueId parameter');
  }
  if (!validate(leagueId)) {
    throw new BadRequestError('Invalid leagueId parameter');
  }

  // Validate profileIds array
  if (!profileIds || profileIds.length === 0) {
    throw new BadRequestError('Missing profileIds parameter');
  }
  if (profileIds.some((id) => !validate(id))) {
    throw new BadRequestError('Invalid profileId format in array');
  }

  // Validate episodeIds array
  if (!episodeIds || episodeIds.length === 0) {
    throw new BadRequestError('Missing episodeIds parameter');
  }
}
export default surveyHelper;
