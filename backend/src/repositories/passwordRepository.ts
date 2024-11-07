import { models } from "../config/db";
import { PasswordAttributes } from "../models/Password";
import { UserAttributes } from "../models/User";

/**
 * A repository for interacting with the `Password` model, which handles password data for users.
 * This repository includes methods to create, retrieve, and manage active and inactive passwords for users.
 * 
 * The `passwordRepository` provides the following functions:
 * - `createPassword`: Creates a new password for a user and stores it in the database.
 * - `getActivePassword`: Retrieves the most recent active password for a user, deactivating older passwords if necessary.
 * - `setInactivePassword`: Marks a password record as inactive.
 * - `getActivePasswordByUser`: Retrieves the active password for a given user.
 * 
 * @module passwordRepository
 */
const passwordRepository = {
    /**
     * Creates a new password record for the given user and stores it in the database.
     * This function stores the user’s password along with a `PASSWORD_SEQ` and sets the password as active.
     * 
     * @param {UserAttributes} user - The user for whom the password is being created.
     * @param {string} hashedPassword - The hashed password to be stored.
     * 
     * @returns {Promise<PasswordAttributes | null>} - A promise that resolves to the created password record, or `null` if the creation fails.
     * 
     * @throws {Error} - If there is an issue creating the password record in the database.
     * 
     * @example
     * const user = { USER_ID: 1, ... }; // user object
     * const hashedPassword = "hashed_password_string";
     * const newPassword = await passwordRepository.createPassword(user, hashedPassword);
     */
    createPassword: async (user : UserAttributes, hashedPassword: string) : Promise<PasswordAttributes | null> => {
        return await models.Password.create({
            USER_ID: user.USER_ID,
            PASSWORD: hashedPassword,
            ACTIVE: true,
            PASSWORD_SEQ: 1,
        })
    },
    /**
     * Retrieves the most recent active password for the given user.
     * If multiple active passwords are found, all but the most recent one are marked as inactive.
     * 
     * @param {UserAttributes} user - The user whose active password is to be retrieved.
     * 
     * @returns {Promise<PasswordAttributes | null>} - A promise that resolves to the most recent active password for the user,
     *          or `null` if no active password is found.
     * 
     * @throws {Error} - If there is an issue retrieving the password from the database.
     * 
     * @example
     * const user = { USER_ID: 1, ... }; // user object
     * const activePassword = await passwordRepository.getActivePassword(user);
     */
    getActivePassword: async (user: UserAttributes) : Promise<PasswordAttributes | null> => {
        const userPasswords = await models.Password.findAll({
            where: { USER_ID : user.USER_ID, ACTIVE : true},
            order: [['createdAt', 'DESC']]
        })

        if(userPasswords.length == 0) return null;

        if (userPasswords.length > 1) {
            await Promise.all(userPasswords.slice(1).map(pw => passwordRepository.setInactivePassword(pw)));
        }

        return userPasswords[0];
    },
    /**
     * Marks a given password record as inactive.
     * This is typically used to deactivate an old password when a new password is created for a user.
     * 
     * @param {PasswordAttributes} passwordRecord - The password record to be marked as inactive.
     * 
     * @returns {Promise<void>} - A promise that resolves when the password record has been successfully updated to inactive.
     * 
     * @throws {Error} - If there is an issue updating the password record in the database.
     * 
     * @example
     * const passwordRecord = { USER_ID: 1, PASSWORD_SEQ: 2, ACTIVE: true, ... };
     * await passwordRepository.setInactivePassword(passwordRecord);
     */
    setInactivePassword: async (passwordRecord: PasswordAttributes) : Promise<void> => {
        await models.Password.update(
            { ACTIVE: false },
            { where: { USER_ID: passwordRecord.USER_ID, PASSWORD_SEQ: passwordRecord.PASSWORD_SEQ} }
        );
    },
    /**
     * Retrieves a single active password record for the given user.
     * Unlike `getActivePassword`, which returns an array of passwords, this function only returns the first active password it finds.
     * 
     * @param {UserAttributes} user - The user whose active password is to be retrieved.
     * 
     * @returns {Promise<PasswordAttributes | null>} - A promise that resolves to the active password record for the user,
     *          or `null` if no active password is found.
     * 
     * @throws {Error} - If there is an issue retrieving the password from the database.
     * 
     * @example
     * const user = { USER_ID: 1, ... }; // user object
     * const activePassword = await passwordRepository.getActivePasswordByUser(user);
     */
    getActivePasswordByUser: async (user: UserAttributes) : Promise<PasswordAttributes | null> => {
        return await models.Password.findOne({
            where: { USER_ID: user.USER_ID, ACTIVE: true }
        });
    }
};

export default passwordRepository;