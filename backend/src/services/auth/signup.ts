import { v4 as uuidv4 } from 'uuid';
import { models } from '../../config/db.ts';
import { validateEmail } from '../../controllers/auth/utils/validateRequest.ts';
import { getHashedPassword, isPasswordStrong } from '../../controllers/auth/utils/passwordUtils.ts';
import { RESPONSE_MESSAGES } from '../../routes/ResponseMessageConstants.ts';
import { generateToken } from './tokenService.ts';

interface SignupRequest {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
}

class CustomError extends Error {
    public statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
    }
}

const signupService = async ({ username, email, password, firstName, lastName }: SignupRequest): Promise<{ 
    statusCode: number; 
    message: string; 
    user: { 
        username: string; 
        userProfileId: string; 
    }; 
    token: string; 
}> => {
    if (!validateEmail(email)) {
        throw new CustomError(
            RESPONSE_MESSAGES.SIGNUP.BAD_REQUEST_INVALID_EMAIL.statusCode,
            RESPONSE_MESSAGES.SIGNUP.BAD_REQUEST_INVALID_EMAIL.message
        );
    }

    const existingUserName = await models.User.findOne({ where: { USER_NAME: username } });
    if (existingUserName) {
        throw new CustomError(
            RESPONSE_MESSAGES.SIGNUP.BAD_REQUEST_UNAVAILABLE_USERNAME.statusCode,
            RESPONSE_MESSAGES.SIGNUP.BAD_REQUEST_UNAVAILABLE_USERNAME.message
        );
    }

    const existingEmail = await models.User.findOne({ where: { USER_EMAIL: email } });
    if (existingEmail) {
        throw new CustomError(
            RESPONSE_MESSAGES.SIGNUP.BAD_REQUEST_UNAVAILABLE_EMAIL.statusCode,
            RESPONSE_MESSAGES.SIGNUP.BAD_REQUEST_UNAVAILABLE_EMAIL.message
        );
    }

    if (!isPasswordStrong(password)) {
        throw new CustomError(
            RESPONSE_MESSAGES.SIGNUP.BAD_REQUEST_WEAK_PASSWORD.statusCode,
            RESPONSE_MESSAGES.SIGNUP.BAD_REQUEST_WEAK_PASSWORD.message
        );
    }

    const userProfileId = uuidv4();
    const userId = uuidv4();

    const userRecord = await models.User.create({
        USER_NAME: username,
        USER_PROFILE_ID: userProfileId,
        USER_EMAIL: email,
        USER_ID: userId
    });

    const hashedPassword = await getHashedPassword(password);

    await models.Password.create({
        USER_ID: userRecord.USER_ID,
        PASSWORD: hashedPassword,
        ACTIVE: true,
        PASSWORD_SEQ: 1,
    });

    const token = generateToken({ user: userRecord.USER_ID });

    return {
        statusCode: RESPONSE_MESSAGES.SIGNUP.CREATED.statusCode,
        message: RESPONSE_MESSAGES.SIGNUP.CREATED.message,
        user: {
            username: userRecord.USER_NAME,
            userProfileId: userRecord.USER_PROFILE_ID,
        },
        token,
    };
};

export default signupService ;