import { Account, Profile } from '../../generated-api';
import accountService, { AccountIdentifierType } from './accountService';

const profileService = {
  getProfile,
};

async function getProfile(
  identifier: string,
  identifierType: AccountIdentifierType
): Promise<Profile> {
  const account: Account = await accountService.getAccount(
    identifier,
    identifierType
  );
  return account;
}

export default profileService;
