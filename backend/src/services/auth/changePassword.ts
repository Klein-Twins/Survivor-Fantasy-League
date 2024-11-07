// services/auth/changePassword.ts
import { models } from '../../config/db';
import { checkPasswordsMatch, getHashedPassword, isPasswordStrong } from '../../utils/auth/passwordUtils';
import CustomError from '../../utils/CustomError';
import { RESPONSE_MESSAGES } from '../../constants/responseMessages';

interface ChangePasswordServiceResponse {
    statusCode: number;
    message: string;
}

const changePasswordService = async (email: string, oldPassword: string, newPassword: string): Promise<ChangePasswordServiceResponse> => {
    if (!isPasswordStrong(newPassword)) {
        throw new CustomError(
            RESPONSE_MESSAGES.CHANGE_PASSWORD.BAD_REQUEST_WEAK_PASSWORD.statusCode,
            RESPONSE_MESSAGES.CHANGE_PASSWORD.BAD_REQUEST_WEAK_PASSWORD.message
        );
    }

    const userRecord = await models.User.findOne({ where: { USER_EMAIL: email } });
    if (!userRecord) {
        throw new CustomError(
            RESPONSE_MESSAGES.CHANGE_PASSWORD.NOT_FOUND_EMAIL.statusCode,
            RESPONSE_MESSAGES.CHANGE_PASSWORD.NOT_FOUND_EMAIL.message
        );
    }

    const userActivePasswordRecord = await models.Password.findOne({
        where: { USER_ID: userRecord.USER_ID, ACTIVE: true },
    });
    if (!userActivePasswordRecord) {
        throw new CustomError(
            RESPONSE_MESSAGES.CHANGE_PASSWORD.INTERNAL_SERVER_ERROR.statusCode,
            RESPONSE_MESSAGES.CHANGE_PASSWORD.INTERNAL_SERVER_ERROR.message
        );
    }

    if (!await checkPasswordsMatch(oldPassword, userActivePasswordRecord.PASSWORD)) {
        throw new CustomError(
            RESPONSE_MESSAGES.CHANGE_PASSWORD.UNAUTHORIZED.statusCode,
            RESPONSE_MESSAGES.CHANGE_PASSWORD.UNAUTHORIZED.message
        );
    }

    const hashedNewPassword = await getHashedPassword(newPassword);
    await models.Password.update(
        { ACTIVE: false },
        { where: { USER_ID: userRecord.USER_ID, ACTIVE: true } }
    );
    await models.Password.create({
        USER_ID: userRecord.USER_ID,
        PASSWORD: hashedNewPassword,
        ACTIVE: true,
        PASSWORD_SEQ: userActivePasswordRecord.PASSWORD_SEQ + 1,
    });

    return {
        statusCode: RESPONSE_MESSAGES.CHANGE_PASSWORD.OK.statusCode,
        message: RESPONSE_MESSAGES.CHANGE_PASSWORD.OK.message,
    };
};

export default changePasswordService;