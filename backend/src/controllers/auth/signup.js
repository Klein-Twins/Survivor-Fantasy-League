const UserModel = require("../../models/User");
const PasswordModel = require("../../models/Password");
const { v4: uuidv4 } = require("uuid");

const {
  RESPONSE_MESSAGES,
  STATUS_CODES
} = require("../../routes/ResponseMessageConstants.js");

const { validateRequiredRequestFields, validateEmail } = require('./utils/validateRequest.js');

const { getHashedPassword, isPasswordStrong } = require("./utils/passwordUtils.js");
const errorHandler = require("../../middleware/errorHandler.js");

//Signup API
const signup = async (req, res) => {
  const requiredFields = ["email", "username", "password"]
  if(!validateRequiredRequestFields(req, res, requiredFields, RESPONSE_MESSAGES.SIGNUP)) {
    return res;
  }

  const { username, password, firstName, lastName } = req.body;
  let email = req.body.email.toLowerCase();

  try {

    //Check if invalid email
    if (!validateEmail(email)) {
      return errorHandler(RESPONSE_MESSAGES.SIGNUP.BAD_REQUEST_INVALID_EMAIL, req, res);
    }
    
    //Check if username already taken
    const existingUserName = await UserModel.findOne({
      where: { USER_NAME: username },
    });
    if (existingUserName) {
      return errorHandler(RESPONSE_MESSAGES.SIGNUP.BAD_REQUEST_UNAVAILABLE_USERNAME, req, res);
    }

    //Check if user email aready tied to an account
    const existingEmail = await UserModel.findOne({
      where: { USER_EMAIL: email },
    });

    //Check if email is already used for a user
    if (existingEmail) {
      return errorHandler(RESPONSE_MESSAGES.SIGNUP.BAD_REQUEST_UNAVAILABLE_EMAIL, req, res);
    }

    if (!isPasswordStrong(password)) {
      return errorHandler(RESPONSE_MESSAGES.SIGNUP.BAD_REQUEST_WEAK_PASSWORD, req ,res);
    }

    //Generate a userProfileId
    const userProfileId = uuidv4();
    //Create a new user
    const userRecord = await UserModel.create({
      USER_NAME: username,
      USER_PROFILE_ID: userProfileId,
      USER_EMAIL: email,
    });

    //Hash password and store in Passwords Table
    const hashedPassword = await getHashedPassword(password)

    await PasswordModel.create({
      USER_ID: userRecord.USER_ID,
      PASSWORD: hashedPassword,
      ACTIVE: true,
      PASSWORD_SEQ: 1,
    });

    res.status(RESPONSE_MESSAGES.SIGNUP.CREATED.statusCode).json({
      message: RESPONSE_MESSAGES.SIGNUP.CREATED.message,
      user: {
        username: userRecord.USER_NAME,
        userProfileId: userRecord.USER_PROFILE_ID,
      },
    });
  } catch (error) {
    console.error("Internal Server Error", error);
    return errorHandler(RESPONSE_MESSAGES.SIGNUP.INTERNAL_SERVER_ERROR, req, res);
  }
};

module.exports = signup;