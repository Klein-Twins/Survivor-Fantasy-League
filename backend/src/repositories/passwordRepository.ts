import { models } from "../config/db";
import { PasswordAttributes } from "../models/Password";
import { UserAttributes } from "../models/User";

const passwordRepository = {
    createPassword: async (user : UserAttributes, hashedPassword: string) : Promise<PasswordAttributes | null> => {
        return await models.Password.create({
            USER_ID: user.USER_ID,
            PASSWORD: hashedPassword,
            ACTIVE: true,
            PASSWORD_SEQ: 1,
        })
    },

    getActivePassword: async (user: UserAttributes) : Promise<PasswordAttributes | null> => {
        const userPasswords = await models.Password.findAll({
            where: { USER_ID : user.USER_ID, ACTIVE : true},
            order: ['createdAt', 'DESC']
        })

        if(userPasswords.length == 0) return null;

        if (userPasswords.length > 1) {
            await Promise.all(userPasswords.slice(1).map(pw => passwordRepository.setInactivePassword(pw)));
        }

        return userPasswords[0];
    },

    setInactivePassword: async (passwordRecord: PasswordAttributes) : Promise<void> => {
        await models.Password.update(
            { ACTIVE: false },
            { where: { USER_ID: passwordRecord.USER_ID, PASSWORD_SEQ: passwordRecord.PASSWORD_SEQ} }
        );
    },

    getActivePasswordByUser: async (user: UserAttributes) : Promise<PasswordAttributes | null> => {
        return await models.Password.findOne({
            where: { USER_ID: user.USER_ID, ACTIVE: true }
        });
    }
};

export default passwordRepository;