import { models } from '../../../../config/db';
import logger from '../../../../config/logger';
import accountService from '../../../../servicesBackup/account/accountService';
import testAccountData, { Account } from '../../accountData/testAccountData';

const accountProcessor = {
  processTestAccounts,
};

async function processTestAccounts() {
  // This function will process the account data provided in testAccountData
  const accounts = testAccountData;

  await models.User.destroy({
    where: {},
  });

  for (const account of accounts) {
    logger.debug(`Processing account: ${account.userName}`);
    await accountService.createAccount({
      email: account.email,
      userName: account.userName,
      firstName: account.firstName,
      lastName: account.lastName,
      password: account.password,
      userRole: account.userRole,
      profileId: account.profileId,
      userId: account.userId,
    });
  }
}

export default accountProcessor;
