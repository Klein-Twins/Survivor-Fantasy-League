import { models } from "../config/db";
import { UserAttributes } from '../models/User';

const userRepository = {
    findUserByUsername: async (username: string) : Promise<UserAttributes | null> => {
        return await models.User.findOne({ where: { USER_NAME: username } })
    },
    findUserByEmail: async (email: string) : Promise<UserAttributes | null> => {
        return await models.User.findOne({ where: { USER_EMAIL: email } });
    },
    createUser: async (userId: string, userProfileId: string, username: string, email: string, firstName?: string, lastName?: string): Promise<UserAttributes | null> => {
        return await models.User.create({
            USER_NAME: username,
            USER_PROFILE_ID: userProfileId,
            USER_EMAIL: email,
            USER_ID: userId
        })
    }
};

export default userRepository;