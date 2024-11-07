import { PasswordAttributes } from '../../models/Password';
import bcrypt from 'bcrypt';
import passwordRepository from "../../repositories/passwordRepository";
import { UserAttributes } from '../../models/User';
import errorFactory from '../../utils/errorFactory';

const passwordService = {
    createPassword: async (user: UserAttributes, password: string): Promise<PasswordAttributes | null> => {
        if (!passwordHelper.isPasswordStrong(password)) {
            throw errorFactory({message: 'Password is too weak', statusCode: 400});
        }

        const hashedPassword = await passwordHelper.getHashedPassword(password);
        return await passwordRepository.createPassword(user, hashedPassword);
    },

    checkPasswordAgainstUserPassword: async (user : UserAttributes, password: string): Promise<boolean> => {
        const activePassword = await passwordRepository.getActivePassword(user);
        if (!activePassword) {
            throw errorFactory({message: 'Please reset your password', statusCode: 500});
        }

        return await bcrypt.compare(password, activePassword.PASSWORD);
    }
};

export const passwordHelper = {
    getHashedPassword : async (password: string): Promise<string> => {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    },
    isPasswordStrong : (password: string): boolean => {
        const minLength = 8;
        const hasLowercase = /[a-z]/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const hasSpaces = /\s/.test(password);
    
        return password.length >= minLength && hasLowercase && hasUppercase && hasSpecialChar && !hasSpaces;
    },
}

export default passwordService;
