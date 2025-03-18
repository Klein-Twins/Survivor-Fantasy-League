import { Transaction } from 'sequelize';
import passwordHelper from '../../helpers/auth/passwordHelper';
import { UserAttributes } from '../../models/account/User';
import passwordRepository from '../../repositories/account/passwordRepository';
import userRepository from '../../repositories/account/userRepository';
import { BadRequestError, NotFoundError } from '../../utils/errors/errors';
import logger from '../../config/logger';

const passwordService = {
  createPassword,
  authenticatePassword,
};

async function authenticatePassword(
  userId: UserAttributes['userId'],
  password: string
): Promise<boolean> {
  const userPassword = await passwordRepository.getActivePassword(userId);
  if (!userPassword) {
    logger.error('No active password found for user with userId: ', userId);
    return false;
  }
  return await passwordHelper.doPasswordsMatch(password, userPassword.password);
}

async function createPassword(
  userId: UserAttributes['userId'],
  password: string,
  transaction?: Transaction
): Promise<void> {
  if (!passwordHelper.isPasswordStrong(password)) {
    throw new BadRequestError('Password is too weak');
  }

  if (!(await userRepository.getUserByField('userId', userId, transaction))) {
    throw new NotFoundError('User not found');
  }

  const hashedPassword = await passwordHelper.getHashedPassword(password);
  await passwordRepository.createPassword(userId, hashedPassword, transaction);
}

export default passwordService;
