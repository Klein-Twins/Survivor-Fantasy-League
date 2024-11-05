const UserModel = require("../../models/User");
const PasswordModel = require("../../models/Password");
const { validateEmail } = require('../../controllers/auth/utils/validateRequest.js');
const { checkPasswordsMatch } = require('../../controllers/auth/utils/passwordUtils.js');
const { RESPONSE_MESSAGES } = require("../../routes/ResponseMessageConstants.js");
const { generateToken } = require("./tokenService.js");

class CustomError extends Error {
    constructor(statusCode, message) {
      super(message);
      this.statusCode = statusCode;
    }
  }
  
  const loginService = async (email, password) => {
    if (!validateEmail(email)) {
      throw new CustomError(RESPONSE_MESSAGES.LOGIN.BAD_REQUEST_INVALID_EMAIL.statusCode, RESPONSE_MESSAGES.LOGIN.BAD_REQUEST_INVALID_EMAIL.message);
    }
  
    const userRecordTiedToEmail = await UserModel.findOne({
      where: { USER_EMAIL: email },
    });
    if (!userRecordTiedToEmail) {
      throw new CustomError(RESPONSE_MESSAGES.LOGIN.NOT_FOUND_EMAIL.statusCode, RESPONSE_MESSAGES.LOGIN.NOT_FOUND_EMAIL.message);
    }
  
    const userPasswordRecord = await PasswordModel.findOne({
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
        userProfileId: userRecordTiedToEmail.USER_PROFILE_ID
      },
      token,
    };
  };
  
  module.exports = { loginService };