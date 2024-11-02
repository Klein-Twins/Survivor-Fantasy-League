const bcrypt = require("bcrypt");
const UserModel = require("../../models/User");
const PasswordModel = require("../../models/Password");

const {
  LOGIN_RESPONSE_MESSAGES,
} = require("../../routes/auth/authResponseMessageConstants");

const { isValidEmail } = require("../../utils/auth/EmailUtils");

const login = async (req, res) => {
  const { password } = req.body;
  let { email } = req.body;

  if (!email || email.length === 0) {
    return res
      .status(400)
      .json({ message: LOGIN_RESPONSE_MESSAGES.BAD_REQUEST.NO_EMAIL });
  }
  if (!password || password.length === 0) {
    return res
      .status(400)
      .json({ message: LOGIN_RESPONSE_MESSAGES.BAD_REQUEST.NO_PASSWORD });
  }

  try {
    email = email.toLowerCase();

    if (!isValidEmail(email)) {
      return res
        .status(400)
        .json({ message: LOGIN_RESPONSE_MESSAGES.BAD_REQUEST.INVALID_EMAIL });
    }

    //Find user by username
    const userRecordTiedToEmail = await UserModel.findOne({
      where: { USER_EMAIL: email },
    });
    if (!userRecordTiedToEmail) {
      return res
        .status(404)
        .json({ message: LOGIN_RESPONSE_MESSAGES.NOT_FOUND });
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
        message: LOGIN_RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }

    //Compare password from request and password in database.
    const isPasswordCorrect = await bcrypt.compare(
      password,
      userPasswordRecord.PASSWORD
    );

    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ message: LOGIN_RESPONSE_MESSAGES.UNAUTHORIZED });
    }

    res.status(200).json({ message: LOGIN_RESPONSE_MESSAGES.OK });
  } catch (error) {
    console.error("Error in login:", error);
    res
      .status(500)
      .json({ message: LOGIN_RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

module.exports = login;
