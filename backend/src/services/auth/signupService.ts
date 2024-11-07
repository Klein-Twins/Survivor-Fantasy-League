import { AuthSignupResponseData, signupFields } from '../../types/auth';
import responseFormatter from '../../utils/auth/responseFormatter';
import { UserAttributes } from '../../models/User';
import tokenService from './tokenService';
import userService from '../userService';
import errorFactory from '../../utils/errorFactory';
import userRepository from '../../repositories/userRepository';


const signupService = async (fields: signupFields): Promise<AuthSignupResponseData> => {

    if(await userRepository.findUserByEmail(fields.email)) throw errorFactory({message: 'Email already tied to account', statusCode: 400});
    if(await userRepository.findUserByUsername(fields.username)) throw errorFactory({message: 'Username already tied to account', statusCode: 400});

    const userRecord : UserAttributes = await userService.createUser(fields)

    const token : string = tokenService.generateToken({ user: userRecord.USER_ID });

    return responseFormatter.formatSignupResponse(
        201,
        'User created successfully',
        userRecord,
        token
    );
};

export default signupService;