import { Request } from 'express';
import { ProfileAttributes } from '../../../models/account/Profile';
import { EpisodeAttributes } from '../../../models/season/Episodes';
import { LeagueAttributes } from '../../../models/league/League';
import leagueHelper from '../leagueHelper';
import profileHelper from '../../auth/profileHelper';
import episodeHelper from '../../season/episodeHelper';

const surveyHelper = {
  validateAndFormatGetSurveyForLeagueMember,
};

async function validateAndFormatGetSurveyForLeagueMember(
  req: Request
): Promise<{
  leagueId: LeagueAttributes['leagueId'];
  profileIds: ProfileAttributes['profileId'][];
  episodeIds: EpisodeAttributes['episodeId'][];
}> {
  const leagueId = req.params.leagueId;
  leagueHelper.validateLeagueId(leagueId);

  const profileIds = Array.isArray(req.query.profileId)
    ? (req.query.profileId as string[])
    : req.query.profileId
    ? [req.query.profileId as string]
    : [];
  await profileHelper.validateProfileIds(profileIds);

  const episodeIds = Array.isArray(req.query.episodeId)
    ? (req.query.episodeId as string[]).map(String)
    : req.query.episodeId
    ? [String(req.query.episodeId)]
    : [];
  await episodeHelper.validateEpisodeIds(episodeIds);

  return {
    leagueId,
    profileIds,
    episodeIds,
  };
}

export default surveyHelper;
