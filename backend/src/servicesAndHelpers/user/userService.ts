import userRepository from '../../repositories/userRepository';
import passwordRepository from '../../repositories/passwordRepository';
import errorFactory from '../../utils/errors/errorFactory';
import passwordService from '../password/passwordService';

import { UserAttributes } from "../../models/User";
import { Transaction } from 'sequelize';
import { PLEASE_RESET_PASSWORD } from '../../constants/auth/responseErrorConstants';
import logger from '../../config/logger';
import { AccountAndPassword } from '../../types/auth/authTypes';

const userService = {

  createUserForAccount: async (accountAndPassword: AccountAndPassword, transaction: Transaction) : Promise<UserAttributes> => {
    const userRecordCreationInput:UserAttributes = {
      email: accountAndPassword.email,
      userId: accountAndPassword.userId,
      userName: accountAndPassword.userName,
      profileId: accountAndPassword.profileId
    };
    return userRepository.createUserRecord(userRecordCreationInput, transaction)
  },

  isUsernameAvailable: async (username: UserAttributes['userName']) : Promise<boolean> => {
    return userRepository.isUsernameAvailable(username);
  },
  isEmailAvailable: async (email: UserAttributes["email"]) : Promise<boolean> => {
    return userRepository.isEmailAvailable(email);
  },
  
  authenticateUser: async (userRecord: UserAttributes, password: string): Promise<boolean> => {
    // Retrieve the active password record for the user
    const activePasswordRecord = await passwordRepository.getActivePasswordForUserId(userRecord.userId);
  
    if (!activePasswordRecord) {
      logger.error(`No active password found for user id: ${userRecord.userId}`);
      throw errorFactory(PLEASE_RESET_PASSWORD);
    }
  
    // Check the provided password against the stored password
    return await passwordService.checkPasswordAgainstUserPassword(userRecord, password);
  },
};

export default userService;