import { models } from '../../config/db';
import { Profile } from '../../generated-api';
import profileHelper from '../../helpers/auth/profileHelper';
import { ProfileAttributes } from '../../models/account/Profile';
import { LeagueProfileAttributes } from '../../models/league/LeagueProfile';
import { NotFoundError } from '../../utils/errors/errors';

const profileRepository = {
  getProfileIdByLeagueProfileId,
};

async function getProfileIdByLeagueProfileId(
  leagueProfileId: LeagueProfileAttributes['id']
): Promise<ProfileAttributes['profileId']> {
  const leagueProfileAttributes: LeagueProfileAttributes[] =
    await models.LeagueProfile.findAll({
      where: {
        id: leagueProfileId,
      },
    });
  if (leagueProfileAttributes.length === 0) {
    throw new NotFoundError(`League Profile Id Not Found ${leagueProfileId}`);
  }
  return leagueProfileAttributes[0].profileId;
}

export default profileRepository;
