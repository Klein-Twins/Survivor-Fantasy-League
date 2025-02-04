import userRepository from '../../repositories/userRepository';
import { UserAttributes } from '../../models/account/User';
import { Transaction } from 'sequelize';
import { AccountAndPassword } from '../../types/auth/authTypes';

const userService = {
  createUserForAccount: async (
    accountAndPassword: AccountAndPassword,
    transaction: Transaction
  ): Promise<UserAttributes> => {
    const userRecordCreationInput: UserAttributes = {
      email: accountAndPassword.email,
      userId: accountAndPassword.userId,
      userName: accountAndPassword.userName,
      profileId: accountAndPassword.profileId,
    };
    return userRepository.createUserRecord(userRecordCreationInput, transaction);
  },

  isUsernameAvailable: async (username: UserAttributes['userName']): Promise<boolean> => {
    return userRepository.isUsernameAvailable(username);
  },
  isEmailAvailable: async (email: UserAttributes['email']): Promise<boolean> => {
    return userRepository.isEmailAvailable(email);
  },

  // authenticateUser: async (userRecord: UserAttributes, password: string): Promise<boolean> => {
  //   // Retrieve the active password record for the user
  //   const activePasswordRecord = await passwordRepository.getActivePasswordForUserId(userRecord.userId);

  //   if (!activePasswordRecord) {
  //     logger.error(`No active password found for user id: ${userRecord.userId}`);
  //     throw errorFactory(PLEASE_RESET_PASSWORD_ERROR);
  //   }

  //   await passwordService.
  //   // Check the provided password against the stored password
  //   return await passwordService.checkPasswordAgainstUserPassword(userRecord, password);

  // },

  getUserIdByProfileId: async (profileId: string): Promise<string | null> => {
    return await userRepository.getUserIdByProfileId(profileId);
  },
};

export default userService;
