import userRepository from '../../repositories/userRepository';
import errorFactory from '../../utils/errorFactory';
import { loginFields, AuthLoginResponseData } from '../../types/auth';
import responseFormatter from '../../utils/auth/responseFormatter';
import { UserAttributes } from '../../models/User';
import tokenService from './tokenService';
import userService from '../userService';

const loginService = {
    login: async (fields : loginFields): Promise<AuthLoginResponseData> => {
    
        const userRecord : UserAttributes | null = await userRepository.findUserByEmail(fields.email);
        if(!userRecord) throw errorFactory({message: "No account tied to email", statusCode: 404})
    
        if(!await userService.authenticateUser(userRecord, fields.password)) throw errorFactory({message: 'Incorrect password', statusCode: 401});
    
        const token = tokenService.generateToken({ user: userRecord.USER_ID });
    
        return responseFormatter.formatLoginResponse(
            200,
            'User authenticated successfully',
            userRecord,
            token
        );
    }
}

export default loginService;