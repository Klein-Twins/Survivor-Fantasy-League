const bcrypt = require("bcrypt");
const UserModel = require("../models/User");
const PasswordModel = require("../models/Password");
const { v4: uuidv4 } = require("uuid");

const {
  AUTH_RESPONSE_MESSAGES,
} = require("../routes/ResponseMessageConstants");

const {
  isPasswordStrongEnough,
} = require('../utils/auth/PasswordUtils');
const {
  isValidEmail
} = require('../utils/auth/EmailUtils');

//Signup API
const signup = async (req, res) => {
  const { email, username, password } = req.body;

  if(!email || email.length === 0) {
    return res.status(400).json({message: AUTH_RESPONSE_MESSAGES.NO_EMAIL_PROVIDED});
  }
  if(!username || username.length === 0) {
    return res.status(400).json({message: AUTH_RESPONSE_MESSAGES.NO_USER_NAME_PROVIDED});
  }
  if(!password || password.length === 0) {
    return res.status(400).json({message: AUTH_RESPONSE_MESSAGES.NO_PASSWORD_PROVIDED});
  }

  try {
    //Check if username already exists
    const existingUserName = await UserModel.findOne({
      where: { USER_NAME: username },
    });
    if (existingUserName) {
      return res
        .status(400)
        .json({ message: AUTH_RESPONSE_MESSAGES.USERNAME_TAKEN });
    }

    //Check if Email is valid
    if (!isValidEmail(email)) {
      return res
        .status(400)
        .json({ message: AUTH_RESPONSE_MESSAGES.EMAIL_NOT_VALID})
    }

    //Check if user email aready tied to an account
    const existingEmail = await UserModel.findOne({
      where: { USER_EMAIL: email }
    });
    if(existingEmail) {
      return res
        .status(400)
        .json({ message: AUTH_RESPONSE_MESSAGES.EMAIL_IN_USE });
    }

    if(!isPasswordStrongEnough(password)) {
      return res
        .status(400)
        .json({ message: AUTH_RESPONSE_MESSAGES.WEAK_PASSWORD });
    }

    //Generate a userProfileId
    const userProfileId = uuidv4();

    //Create a new user
    const userRecord = await UserModel.create({
      USER_NAME: username,
      USER_PROFILE_ID: userProfileId,
      USER_EMAIL: email
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
      message: AUTH_RESPONSE_MESSAGES.SIGNUP_SUCCESS,
      user: {
        username: userRecord.USER_NAME,
        userProfileId: userRecord.USER_PROFILE_ID,
      },
    });
    
  } catch (error) {
    console.error("Internal Server Error", error);
    res.status(500).json({ message: AUTH_RESPONSE_MESSAGES.SIGNUP_SERVER_ERROR });
  }
};

//Login API
const login = async (req, res) => {
  const { email, password } = req.body;

  if(!email || email.length === 0) {
    return res.status(400).json({message: AUTH_RESPONSE_MESSAGES.NO_EMAIL_PROVIDED});
  }
  if(!password || password.length === 0) {
    return res.status(400).json({message: AUTH_RESPONSE_MESSAGES.NO_PASSWORD_PROVIDED});
  }

  try {

    if(!isValidEmail(email)) {
      return res.status(400).json({message: AUTH_RESPONSE_MESSAGES.EMAIL_NOT_VALID})
    }

    //Find user by username
    const userRecordTiedToEmail = await UserModel.findOne({ where: { USER_EMAIL: email } });
    if (!userRecordTiedToEmail) {
      return res.status(404).json({ message: AUTH_RESPONSE_MESSAGES.EMAIL_NOT_FOUND });
    }

    //Find active password for the user
    const userPasswordRecord = await PasswordModel.findOne({
      where: {
        USER_ID: userRecordTiedToEmail.USER_ID,
        ACTIVE: true,
      },
    });

    if (!userPasswordRecord) {
      return res.status(500).json({
        message: AUTH_RESPONSE_MESSAGES.LOGIN_SERVER_ERROR,
      });
    }

    //Compare password from request and password in database.
    const isPasswordCorrect = await bcrypt.compare(
      password,
      userPasswordRecord.PASSWORD
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: AUTH_RESPONSE_MESSAGES.INCORRECT_PASSWORD });
    }

    res.status(200).json({ message: AUTH_RESPONSE_MESSAGES.LOGIN_SUCCESS });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: AUTH_RESPONSE_MESSAGES.LOGIN_SERVER_ERROR });
  }
};

module.exports = {
  signup,
  login,
};
