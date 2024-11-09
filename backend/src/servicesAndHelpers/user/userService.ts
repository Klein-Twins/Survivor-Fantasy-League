import userRepository from '../../repositories/userRepository';
import passwordRepository from '../../repositories/passwordRepository';
import errorFactory from '../../utils/errors/errorFactory';
import passwordService from '../password/passwordService';

import { UserAttributes } from "../../models/User";
import { AccountAndPasswordAttributes } from '../../repositories/accountRepository';
import { Transaction } from 'sequelize';

const userService = {

  createUserForAccount: async (accountAndPassword: AccountAndPasswordAttributes, transaction: Transaction) : Promise<UserAttributes> => {
    const userRecordCreationInput:UserAttributes = {
      USER_EMAIL: accountAndPassword.USER_EMAIL,
      USER_ID: accountAndPassword.USER_ID,
      USER_NAME: accountAndPassword.USER_NAME,
      USER_PROFILE_ID: accountAndPassword.USER_PROFILE.PROFILE_ID
    };
    return userRepository.createUserRecord(userRecordCreationInput, transaction)
  },

  isUsernameAvailable: async (username: UserAttributes['USER_NAME']) : Promise<boolean> => {
    return userRepository.isUsernameAvailable(username);
  },
  isEmailAvailable: async (email: UserAttributes["USER_EMAIL"]) : Promise<boolean> => {
    return userRepository.isEmailAvailable(email);
  },
  
  authenticateUser: async (userRecord: UserAttributes, password: string): Promise<boolean> => {
    // Retrieve the active password record for the user
    const activePasswordRecord = await passwordRepository.getActivePasswordForUserId(userRecord.USER_ID);
  
    if (!activePasswordRecord) {
      throw errorFactory({
        message: 'Please reset your password',
        statusCode: 401
      });
    }
  
    // Check the provided password against the stored password
    return await passwordService.checkPasswordAgainstUserPassword(userRecord, password);
  },
};

export default userService;