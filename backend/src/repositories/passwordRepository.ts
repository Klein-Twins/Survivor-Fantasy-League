import { Transaction } from "sequelize";
import { models, sequelize } from "../config/db";
import { PasswordAttributes } from "../models/Password";
import { UserAttributes } from "../models/User";
import errorFactory from "../utils/errors/errorFactory";
import logger from "../config/logger";
import { INTERNAL_SERVER_ERROR, PLEASE_RESET_PASSWORD } from "../constants/auth/responseErrorConstants";

const passwordRepository = {

    /**
     * Creates a new password record for a user and sets all previous passwords to inactive.
     * 
     * @param userId - The ID of the user to associate the new password with.
     * @param hashedPassword - The hashed password to store in the database.
     * @param transaction - The transaction used for atomic operations.
     * 
     * @returns A promise resolving to the newly created password record.
     */
    createPasswordForUserId: async (
        userId: UserAttributes['userId'],
        hashedPassword: string,
        transaction?: Transaction
    ): Promise<PasswordAttributes> => {
        try {
            const maxPasswordSeqResult = await models.Password.max('passwordSeq', {
                where: { userId },
            });

            const newPasswordSeq = (typeof maxPasswordSeqResult === 'number' ? maxPasswordSeqResult : 0) + 1;

            await passwordRepository.setAllPasswordsForUserIdToInactive(userId, transaction);

            const newPasswordRecord = await models.Password.create({
                userId,
                password: hashedPassword,
                active: true,
                passwordSeq: newPasswordSeq,
            }, { transaction });

            if (!newPasswordRecord) {
                throw errorFactory(INTERNAL_SERVER_ERROR);
            }

            return newPasswordRecord;
        } catch (error) {
            logger.error(`Failed in creating password for user with userId ${userId}: ${error}`);
            throw (error);
        }

    },

    /**
     * Sets all active passwords for a user to inactive.
     * 
     * @param userId - The ID of the user whose passwords should be deactivated.
     * @param transaction - The transaction used for atomic operations.
     * 
     * @returns A promise that resolves when all passwords are set to inactive.
     */
    setAllPasswordsForUserIdToInactive: async (
        userId: UserAttributes["userId"],
        transaction?: Transaction
    ): Promise<void> => {
        try {
            await models.Password.update(
                { active: false },
                {
                    where: {
                        userId: userId,
                        active: true,
                    },
                    transaction
                }
            );
        } catch (error) {
            logger.error(`Failed to set all passwords to inactive for user with userId ${userId}: ${error}`)
            throw (error);
        }
    },

    /**
     * Marks a given password record as inactive.
     * 
     * @param passwordRecord - The password record to deactivate.
     * @param transaction - Optional transaction for atomic operations.
     * 
     * @returns A promise that resolves when the password is deactivated.
     */
    setPasswordRecordToInactive: async (
        passwordRecord: PasswordAttributes,
        transaction?: Transaction
    ): Promise<void> => {
        try {
            await models.Password.update(
                { active: false },
                {
                    where: {
                        userId: passwordRecord.userId,
                        passwordSeq: passwordRecord.passwordSeq,
                    },
                    transaction
                }
            );
        } catch (error) {
            logger.error(`Failed to set password seq ${passwordRecord.passwordSeq} to inactive for user with user id ${passwordRecord.userId}: ${error}`)
            throw (error);
        }
    },

    /**
     * Retrieves the most recent active password for a user.
     * If multiple active passwords are found, they are all marked as inactive except the most recent one.
     * 
     * @param userId - The ID of the user to retrieve the active password for.
     * 
     * @returns A promise that resolves to the most recent active password.
     */
    getActivePasswordForUserId: async (userId: UserAttributes["userId"]): Promise<PasswordAttributes> => {
        const userPasswords = await models.Password.findAll({
            where: { userId, active: true },
            order: [['createdAt', 'DESC']]
        });

        if (userPasswords.length === 0) {
            logger.error(`No active passwords for user id: ${userId}`);
            throw errorFactory(PLEASE_RESET_PASSWORD);
        }

        // Deactivate any extraneous active passwords
        if (userPasswords.length > 1) {
            const transaction: Transaction = await sequelize.transaction();
            try {
                // Deactivate all but the first one
                await Promise.all(userPasswords.slice(1).map(pw => passwordRepository.setPasswordRecordToInactive(pw, transaction)));
                await transaction.commit();
            } catch (error) {
                logger.error("Failed to update all extraneous active passwords to false.");
                await transaction.rollback();
                throw error;
            }
        }

        return userPasswords[0];
    },

    /**
     * Marks a password record as inactive.
     * 
     * @param passwordRecord - The password record to deactivate.
     * @param transaction - Optional transaction for atomic operations.
     * 
     * @returns A promise that resolves when the password is deactivated.
     */
    setInactivePassword: async (
        passwordRecord: PasswordAttributes,
        transaction?: Transaction
    ): Promise<void> => {
        await models.Password.update(
            { active: false },
            { where: { userId: passwordRecord.userId, passwordSeq: passwordRecord.passwordSeq }, transaction }
        );
    },
};

export default passwordRepository;