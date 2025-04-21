import { Transaction } from 'sequelize';
import { Account, League, Profile } from '../../generated-api';
import { UserAttributes } from '../../models/account/User';
import accountService from './accountService';
import { NotFoundError } from '../../utils/errors/errors';
import { LeagueProfileAttributes } from '../../models/league/LeagueProfile';

const profileService = {
  getProfile,
};

async function getProfile(
  field:
    | keyof Pick<UserAttributes, 'userId' | 'userName' | 'email' | 'profileId'>
    | 'leagueProfileId',
  value: string,
  t?: Transaction
): Promise<Profile> {
  try {
    const account: Account = await accountService.getAccount(field, value, t);
    return account as Profile;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new NotFoundError('Profile not found');
    }
    throw error;
  }
}

export default profileService;
