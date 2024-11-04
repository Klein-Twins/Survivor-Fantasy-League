// src/services/auth/changePassword.js
const UserModel = require("../../models/User.js");
const PasswordModel = require("../../models/Password.js");
const { checkPasswordsMatch, getHashedPassword, isPasswordStrong } = require("../../controllers/auth/utils/passwordUtils.js");
const { RESPONSE_MESSAGES } = require("../../routes/ResponseMessageConstants.js");

class CustomError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}

const changePasswordService = async (email, oldPassword, newPassword) => {
    if (!isPasswordStrong(newPassword)) {
        throw new CustomError(
            RESPONSE_MESSAGES.CHANGE_PASSWORD.BAD_REQUEST_WEAK_PASSWORD.statusCode,
            RESPONSE_MESSAGES.CHANGE_PASSWORD.BAD_REQUEST_WEAK_PASSWORD.message
        );
    }

    const userRecord = await UserModel.findOne({ where: { EMAIL: email } });
    if (!userRecord) {
        throw new CustomError(
            RESPONSE_MESSAGES.CHANGE_PASSWORD.NOT_FOUND_EMAIL.statusCode,
            RESPONSE_MESSAGES.CHANGE_PASSWORD.NOT_FOUND_EMAIL.message
        );
    }

    const userActivePasswordRecord = await PasswordModel.findOne({
        where: { USER_ID: userRecord.USER_ID, ACTIVE: true },
    });
    if (!userActivePasswordRecord) {
        throw new CustomError(
            RESPONSE_MESSAGES.CHANGE_PASSWORD.INTERNAL_SERVER_ERROR.statusCode,
            RESPONSE_MESSAGES.CHANGE_PASSWORD.INTERNAL_SERVER_ERROR.message
        );
    }

    const oldPasswordSequence = userActivePasswordRecord.PASSWORD_SEQ;
    if (!await checkPasswordsMatch(oldPassword, userActivePasswordRecord.PASSWORD)) {
        throw new CustomError(
            RESPONSE_MESSAGES.CHANGE_PASSWORD.UNAUTHORIZED.statusCode,
            RESPONSE_MESSAGES.CHANGE_PASSWORD.UNAUTHORIZED.message
        );
    }

    const hashedNewPassword = await getHashedPassword(newPassword);
    await PasswordModel.update(
        { ACTIVE: false },
        { where: { USER_ID: userRecord.USER_ID, ACTIVE: true } }
    );
    await PasswordModel.create({
        PASSWORD_SEQ: oldPasswordSequence + 1,
        USER_ID: userRecord.USER_ID,
        PASSWORD: hashedNewPassword,
        ACTIVE: true,
    });

    return {
        statusCode: RESPONSE_MESSAGES.CHANGE_PASSWORD.OK.statusCode,
        message: RESPONSE_MESSAGES.CHANGE_PASSWORD.OK.message,
    };
};

module.exports = { changePasswordService };