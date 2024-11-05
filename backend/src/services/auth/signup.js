// src/services/auth/signup.js
const UserModel = require("../../models/User");
const PasswordModel = require("../../models/Password");
const { v4: uuidv4 } = require("uuid");
const { validateEmail } = require("../../controllers/auth/utils/validateRequest.js");
const { getHashedPassword, isPasswordStrong } = require("../../controllers/auth/utils/passwordUtils.js");
const { RESPONSE_MESSAGES } = require("../../routes/ResponseMessageConstants.js");
const { generateToken } = require("./tokenService.js");

class CustomError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}

const signupService = async ({ username, email, password, firstName, lastName }) => {
    if (!validateEmail(email)) {
        throw new CustomError(
            RESPONSE_MESSAGES.SIGNUP.BAD_REQUEST_INVALID_EMAIL.statusCode,
            RESPONSE_MESSAGES.SIGNUP.BAD_REQUEST_INVALID_EMAIL.message
        );
    }

    const existingUserName = await UserModel.findOne({ where: { USER_NAME: username } });
    if (existingUserName) {
        throw new CustomError(
            RESPONSE_MESSAGES.SIGNUP.BAD_REQUEST_UNAVAILABLE_USERNAME.statusCode,
            RESPONSE_MESSAGES.SIGNUP.BAD_REQUEST_UNAVAILABLE_USERNAME.message
        );
    }

    const existingEmail = await UserModel.findOne({ where: { USER_EMAIL: email } });
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

    const userRecord = await UserModel.create({
        USER_NAME: username,
        USER_PROFILE_ID: userProfileId,
        USER_EMAIL: email,
    });

    const hashedPassword = await getHashedPassword(password);

    await PasswordModel.create({
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

module.exports = { signupService };