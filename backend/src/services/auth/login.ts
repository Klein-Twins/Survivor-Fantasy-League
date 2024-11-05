import { models } from '../../config/db.ts';
import { validateEmail } from '../../controllers/auth/utils/validateRequest.ts';
import { checkPasswordsMatch } from '../../controllers/auth/utils/passwordUtils.ts';
import { RESPONSE_MESSAGES } from "../../routes/ResponseMessageConstants.ts";
import { generateToken } from "./tokenService.ts";

class CustomError extends Error {
    statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
    }
}

interface LoginServiceResponse {
    statusCode: number;
    message: string;
    user: {
        username: string;
        userProfileId: string; // Adjust type as necessary
    };
    token: string;
}

const loginService = async (email: string, password: string): Promise<LoginServiceResponse> => {
    if (!validateEmail(email)) {
        throw new CustomError(RESPONSE_MESSAGES.LOGIN.BAD_REQUEST_INVALID_EMAIL.statusCode, RESPONSE_MESSAGES.LOGIN.BAD_REQUEST_INVALID_EMAIL.message);
    }

    const userRecordTiedToEmail = await models.User.findOne({
        where: { USER_EMAIL: email },
    });
    if (!userRecordTiedToEmail) {
        throw new CustomError(RESPONSE_MESSAGES.LOGIN.NOT_FOUND_EMAIL.statusCode, RESPONSE_MESSAGES.LOGIN.NOT_FOUND_EMAIL.message);
    }

    const userPasswordRecord = await models.Password.findOne({
        where: {
            USER_ID: userRecordTiedToEmail.USER_ID,
            ACTIVE: true,
        },
    });

    if (!userPasswordRecord) {
        throw new CustomError(RESPONSE_MESSAGES.LOGIN.INTERNAL_SERVER_ERROR.statusCode, RESPONSE_MESSAGES.LOGIN.INTERNAL_SERVER_ERROR.message);
    }

    if (!await checkPasswordsMatch(password, userPasswordRecord.PASSWORD)) {
        throw new CustomError(RESPONSE_MESSAGES.LOGIN.UNAUTHORIZED.statusCode, RESPONSE_MESSAGES.LOGIN.UNAUTHORIZED.message);
    }

    const token = generateToken({ user: userRecordTiedToEmail.USER_ID });

    return {
        statusCode: RESPONSE_MESSAGES.LOGIN.OK.statusCode,
        message: RESPONSE_MESSAGES.LOGIN.OK.message,
        user: {
            username: userRecordTiedToEmail.USER_NAME,
            userProfileId: userRecordTiedToEmail.USER_PROFILE_ID,
        },
        token,
    };
};

export { loginService };