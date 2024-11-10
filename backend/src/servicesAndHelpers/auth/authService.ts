import { UserAttributes } from '../../models/User';
import userRepository from '../../repositories/userRepository';
import { Account, LoginRequestFields } from '../../types/auth/authTypes';
import errorFactory from '../../utils/errors/errorFactory';
import accountService from './accountService';
import passwordService from '../password/passwordService';
import { INCORRECT_PASSWORD } from '../../constants/auth/responseErrorConstants';
import logger from '../../config/logger';

const authService = {
  
  /**
   * Handles user login by validating the provided email and password.
   * If the credentials are correct, it returns the account details.
   * 
   * @param loginRequestData - The login request data containing the user's email and password.
   * @returns A promise that resolves to the account details if authentication is successful.
   * @throws A 401 error if the password is incorrect.
   */
  login: async (loginRequestData: LoginRequestFields): Promise<Account> => {
    const { email, password } = loginRequestData;

    // Retrieve user record based on email
    const userRecord: UserAttributes = await userRepository.findUserRecordByEmail(email);
    logger.debug(`Found user record for ${email}`);

    // Check if the provided password matches the stored user password
    const isAuthenticated: boolean = await passwordService.checkPasswordAgainstUserPassword(userRecord, password);
    logger.debug(`User is authenticated`);
    
    if (!isAuthenticated) {
      throw errorFactory(INCORRECT_PASSWORD);
    }

    // Fetch and return account details
    return await accountService.getAccountByEmail(email);
  },

  /**
   * Handles user logout. This could include invalidating a session or token.
   * (Note: The logout functionality is currently a placeholder for future implementation.)
   */
  logout: async (): Promise<void> => {
    // Placeholder for logout logic
    // For example, token invalidation or session termination can be added here
  },
};

export default authService;