import { v4 as uuidv4 } from 'uuid';
import userRepository from '../repositories/userRepository';
import passwordRepository from '../repositories/passwordRepository';

import errorFactory from '../utils/errorFactory';
import { UserAttributes } from "../models/User";
import { signupFields } from '../types/auth';
import passwordService from './auth/passwordService';

const userService = {
    createUser: async (fields: signupFields) : Promise<UserAttributes> => {

        const userProfileId = uuidv4();
        const userId = uuidv4();
    
        const userRecord = await userRepository.createUser(userId, userProfileId, fields.username, fields.email, fields.firstName, fields.lastName);
        if(!userRecord) throw errorFactory({message: 'Could not create user', statusCode: 500});
    
        const passwordRecord = await passwordRepository.createPassword(userRecord, fields.password);
        if(!passwordRecord) throw errorFactory({message: 'Could not create user', statusCode: 500});
    
        return userRecord;
    },
    authenticateUser: async (userRecord: UserAttributes, password: string): Promise<boolean> => {
        const activePasswordRecord = await passwordRepository.getActivePassword(userRecord);
        if (!activePasswordRecord) throw errorFactory({message: 'Please reset your password', statusCode: 401});
        return await passwordService.checkPasswordAgainstUserPassword(userRecord, password);
    },
}

export default userService;