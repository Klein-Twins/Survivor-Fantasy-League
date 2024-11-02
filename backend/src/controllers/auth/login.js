const UserModel = require("../../models/User");
const PasswordModel = require("../../models/Password");

const { RESPONSE_MESSAGES } = require("../../routes/ResponseMessageConstants.js");

const { validateRequiredRequestFields, validateEmail } = require('./utils/validateRequest.js');
const { checkPasswordsMatch } = require('./utils/checkPassword.js');
const errorHandler = require("../../middleware/errorHandler.js");

const login = async (req, res) => {
  const requiredFields = ["email", "password"];

  if(!validateRequiredRequestFields(req, res, requiredFields, RESPONSE_MESSAGES.LOGIN)) {
    return res;
  }
  
  const { password } = req.body;
  let email = req.body.email.toLowerCase();

  try {
    if(!validateEmail(email)) {
      return errorHandler(RESPONSE_MESSAGES.LOGIN.BAD_REQUEST_INVALID_EMAIL, req, res)
    }

    const userRecordTiedToEmail = await UserModel.findOne({
      where: { USER_EMAIL: email },
    });
    if (!userRecordTiedToEmail) {
      return errorHandler(RESPONSE_MESSAGES.LOGIN.NOT_FOUND_EMAIL, req, res);
    }

    const userPasswordRecord = await PasswordModel.findOne({
      where: {
        USER_ID: userRecordTiedToEmail.USER_ID,
        ACTIVE: true,
      },
    });

    if (!userPasswordRecord) {
      return errorHandler(RESPONSE_MESSAGES.LOGIN.INTERNAL_SERVER_ERROR, req, res);
    }

    if (!await checkPasswordsMatch(password, userPasswordRecord.PASSWORD)) {
      return errorHandler(RESPONSE_MESSAGES.LOGIN.UNAUTHORIZED, req ,res);
    }

    res.status(RESPONSE_MESSAGES.LOGIN.OK.statusCode).json({ message: RESPONSE_MESSAGES.LOGIN.OK.message });

  } catch (error) {
    console.error("Error in login:", error);
    return errorHandler(RESPONSE_MESSAGES.LOGIN.INTERNAL_SERVER_ERROR, req, res);
  }
};

module.exports = login;
