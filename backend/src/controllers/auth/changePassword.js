const UserModel = require("../../models/User.js");
const PasswordModel = require("../../models/Password.js");

const { validateRequiredRequestFields } = require('./utils/validateRequest.js');
const { checkPasswordsMatch, getHashedPassword, isPasswordStrong } = require('./utils/passwordUtils.js');
const errorHandler = require("../../middleware/errorHandler.js");

const { RESPONSE_MESSAGES } = require("../../routes/ResponseMessageConstants.js");


const changePassword = async (req, res) => {
  const requiredFields = ["email", "oldPassword", "newPassword"]
  if(!validateRequiredRequestFields(req, res, requiredFields, RESPONSE_MESSAGES.CHANGE_PASSWORD)) {
    return res;
  }

  const { oldPassword, newPassword } = req.body;
  let email = req.body.email.toLowerCase();

  try {

    const isValidPassword = isPasswordStrong(newPassword);
    if (!isValidPassword) {
      return errorHandler(RESPONSE_MESSAGES.CHANGE_PASSWORD.BAD_REQUEST_WEAK_PASSWORD, req, res);
    }

    const userRecord = await UserModel.findOne({
      where: { EMAIL: email },
    });
    if (!userRecord) {
      return errorHandler(RESPONSE_MESSAGES.CHANGE_PASSWORD.NOT_FOUND_EMAIL, req, res);
    }

    const userActivePasswordRecord = await PasswordModel.findOne({
      where: { USER_ID: userRecord.USER_ID, ACTIVE: true },
    });
    if (!userActivePasswordRecord) {
      return errorHandler(RESPONSE_MESSAGES.CHANGE_PASSWORD.INTERNAL_SERVER_ERROR, req, res);
    }
    const oldPasswordSequence = userActivePasswordRecord.PASSWORD_SEQ;
    if (!await checkPasswordsMatch(oldPassword, userActivePasswordRecord.PASSWORD)) {
      return errorHandler(RESPONSE_MESSAGES.CHANGE_PASSWORD.UNAUTHORIZED, req, res);
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

    return res
      .status(RESPONSE_MESSAGES.CHANGE_PASSWORD.OK.statusCode)
      .json({ message: RESPONSE_MESSAGES.CHANGE_PASSWORD.OK.message });
  } catch (error) {
    console.error(error);
    return errorHandler(RESPONSE_MESSAGES.CHANGE_PASSWORD.INTERNAL_SERVER_ERROR, req, res);
  }
};

module.exports = changePassword;
