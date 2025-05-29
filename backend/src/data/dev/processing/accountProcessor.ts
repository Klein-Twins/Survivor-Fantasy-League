import { container } from 'tsyringe';
import { Account } from '../../../domain/account/Account';
import { ProfileAttributes } from '../../../models/account/Profile';
import { UserAttributes } from '../../../models/account/User';
import { SeedAccount } from '../data/account/ids';
import { AccountService } from '../../../services/account/AccountService';

const accountProcessor = {
  processAccountsData,
  processAccountData,
};

async function processAccountsData(accountsData: SeedAccount[]) {
  for (const accountData of accountsData) {
    await processAccountData(accountData);
  }
}

async function processAccountData(accountData: SeedAccount): Promise<Account> {
  const userAttributes: UserAttributes = {
    userId: accountData.userId,
    userName: accountData.userName,
    profileId: accountData.profileId,
    email: accountData.email,
    userRole: accountData.userRole,
  };

  const profileAttributes: ProfileAttributes = {
    profileId: accountData.profileId,
    firstName: accountData.firstName,
    lastName: accountData.lastName,
  };

  const unhashedPassword = accountData.password;

  const account = await container.resolve(AccountService).createAccount({
    email: userAttributes.email,
    password: unhashedPassword,
    userName: userAttributes.userName,
    firstName: profileAttributes.firstName,
    lastName: profileAttributes.lastName,
    profileId: profileAttributes.profileId,
    userId: userAttributes.userId,
    accountRole: userAttributes.userRole,
  });

  return account;
}

export default accountProcessor;
