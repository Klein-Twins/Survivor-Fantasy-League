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
  episodeNumbers: EpisodeAttributes['episodeNumber'][];
}> {
  const leagueId = req.params.leagueId;
  leagueHelper.validateLeagueId(leagueId);

  const profileIds = Array.isArray(req.query.profileId)
    ? (req.query.profileId as string[])
    : req.query.profileId
    ? [req.query.profileId as string]
    : [];
  await profileHelper.validateProfileIds(profileIds);

  const episodeNumbers = Array.isArray(req.query.episodeNumber)
    ? (req.query.episodeNumber as string[]).map(Number)
    : req.query.episodeNumber
    ? [Number(req.query.episodeNumber)]
    : [];
  await episodeHelper.validateEpisodeNumbers(episodeNumbers);

  return {
    leagueId,
    profileIds,
    episodeNumbers,
  };
}

export default surveyHelper;
