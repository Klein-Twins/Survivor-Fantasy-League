import { Transaction } from 'sequelize';
import { Account } from '../../domain/account/Account';
import logger from '../../config/logger';
import { UserRepository } from './UserRepository';
import { ProfileRepository } from './ProfileRepository';
import { PasswordRepository } from './PasswordRepository';
import { UserAttributes } from '../../models/account/User';
import { ProfileAttributes } from '../../models/account/Profile';
import { models } from '../../config/db';
import { NotFoundError } from '../../utils/errors/errors';
import { inject, injectable } from 'tsyringe';
import { PasswordAttributes } from '../../models/account/Password';

type AccountData = UserAttributes & {
  profile: ProfileAttributes;
  passwords: PasswordAttributes[];
};

injectable();
export class AccountRepository {
  constructor(
    @inject(UserRepository) private userRepository: UserRepository,
    @inject(ProfileRepository) private profileRepository: ProfileRepository,
    @inject(PasswordRepository) private passwordRepository: PasswordRepository
  ) {}

  /**
   * @description Fetches the account data by a specific field.
   * @param field The field to search by. - userName, accountId, profileId, email
   * @param value The value to search for. - Account['userName'], Account['accountId'], Account['profileId'], Account['email']
   * @throws NotFoundError if the account is not found.
   * @returns The account data from the database. The Account data includes the profile data.
   */
  async fetchAccountDataByField({
    field,
    value,
  }: {
    field: 'userName' | 'accountId' | 'profileId' | 'email';
    value:
      | Account['userName']
      | Account['accountId']
      | Account['profileId']
      | Account['email'];
  }): Promise<AccountData> {
    logger.debug(`Fetching account by ${field}: ${value} in DB.`);

    const account = (await models.User.findOne({
      where: {
        [field]: value,
      },
      include: [
        {
          model: models.Profile,
          as: 'profile',
        },
        {
          model: models.Password,
          as: 'passwords',
          required: true,
        },
      ],
    })) as unknown as AccountData;

    if (!account) {
      throw new NotFoundError(`Account not found by ${field}: ${value} in DB.`);
    }
    logger.debug(`Fetched account by ${field}: ${value} in DB.`);
    return account;
  }

  /**
   * Saves the account to the database.
   * @param account The account to save.
   * @param password The password to save.
   * @param transaction The transaction to use.
   */
  async saveAccount(account: Account, transaction: Transaction): Promise<void> {
    logger.debug(`Saving ${account.toString()}`);
    await this.profileRepository.saveProfileAttributes(
      {
        firstName: account.getFirstName(),
        lastName: account.getLastName(),
        profileId: account.getProfileId(),
      },
      transaction
    );

    await this.userRepository.saveUserAttributes(
      {
        userId: account.getAccountId(),
        userName: account.getUserName(),
        email: account.getEmail(),
        profileId: account.getProfileId(),
        userRole: account.getAccountRole(),
      },
      transaction
    );

    await this.passwordRepository.saveNewPassword(
      {
        password: account.getActivePassword().getHashedPassword(),
        userId: account.getAccountId(),
      },
      transaction
    );

    logger.debug(`Saved ${account.toString()}`);
  }
}
