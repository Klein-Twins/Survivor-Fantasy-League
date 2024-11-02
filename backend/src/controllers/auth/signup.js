const bcrypt = require("bcrypt");
const UserModel = require("../../models/User");
const PasswordModel = require("../../models/Password");
const { v4: uuidv4 } = require("uuid");

const {
  SIGNUP_RESPONSE_MESSAGES,
} = require("../../routes/auth/authResponseMessageConstants");

const { isPasswordStrongEnough } = require("../../utils/auth/PasswordUtils");
const { isValidEmail } = require("../../utils/auth/EmailUtils");

//Signup API
const signup = async (req, res) => {
  let { email, username, password } = req.body;

  if (!email || email.length === 0) {
    return res
      .status(400)
      .json({ message: SIGNUP_RESPONSE_MESSAGES.BAD_REQUEST.NO_EMAIL });
  }
  if (!username || username.length === 0) {
    return res
      .status(400)
      .json({ message: SIGNUP_RESPONSE_MESSAGES.BAD_REQUEST.NO_USERNAME });
  }
  if (!password || password.length === 0) {
    return res
      .status(400)
      .json({ message: SIGNUP_RESPONSE_MESSAGES.BAD_REQUEST.NO_PASSWORD });
  }

  try {
    email = email.toLowerCase();

    //Check if username already exists
    const existingUserName = await UserModel.findOne({
      where: { USER_NAME: username },
    });
    if (existingUserName) {
      return res
        .status(400)
        .json({ message: SIGNUP_RESPONSE_MESSAGES.BAD_REQUEST.UNAVAILABLE_USERNAME });
    }

    //Check if Email is valid
    if (!isValidEmail(email)) {
      return res
        .status(400)
        .json({ message: SIGNUP_RESPONSE_MESSAGES.BAD_REQUEST.INVALID_EMAIL });
    }

    //Check if user email aready tied to an account
    const existingEmail = await UserModel.findOne({
      where: { USER_EMAIL: email },
    });
    if (existingEmail) {
      return res
        .status(400)
        .json({ message: SIGNUP_RESPONSE_MESSAGES.BAD_REQUEST.UNAVAILABLE_EMAIL });
    }

    if (!isPasswordStrongEnough(password)) {
      return res
        .status(400)
        .json({ message: SIGNUP_RESPONSE_MESSAGES.BAD_REQUEST.WEAK_PASSWORD });
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
    const hashedPassword = await bcrypt.hash(password, 10);

    const passwordRecord = await PasswordModel.create({
      USER_ID: userRecord.USER_ID,
      PASSWORD: hashedPassword,
      ACTIVE: true,
      PASSWORD_SEQ: 1,
    });

    res.status(201).json({
      message: SIGNUP_RESPONSE_MESSAGES.CREATED,
      user: {
        username: userRecord.USER_NAME,
        userProfileId: userRecord.USER_PROFILE_ID,
      },
    });
  } catch (error) {
    console.error("Internal Server Error", error);
    res
      .status(500)
      .json({ message: SIGNUP_RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

module.exports = signup;