const bcrypt = require("bcrypt");
const UserModel = require("../../models/User.js");
const PasswordModel = require("../../models/Password.js");

const { isPasswordStrongEnough } = require('../../utils/auth/PasswordUtils.js');

const {
  AUTH_RESPONSE_MESSAGES,
  CHANGE_PASSWORD_RESPONSE_MESSAGES,
} = require("../../routes/ResponseMessageConstants");

const changePassword = async (req, res) => {
    let { email }  = req.body;
    const { oldPassword, newPassword } = req.body;

    if(!email || email.length === 0) {
      return res.status(400).json({message: CHANGE_PASSWORD_RESPONSE_MESSAGES.BAD_REQUEST.MISSING_EMAIL});
    }
    if(!oldPassword || oldPassword.length === 0) {
      return res.status(400).json({message: CHANGE_PASSWORD_RESPONSE_MESSAGES.BAD_REQUEST.MISSING_OLD_PASSWORD});
    }
    if(!newPassword || newPassword.length === 0) {
      return res.status(400).json({message: CHANGE_PASSWORD_RESPONSE_MESSAGES.BAD_REQUEST.MISSING_NEW_PASSWORD});
    }

    try {
      email = email.toLowerCase();

      const isValidPassword = isPasswordStrongEnough(newPassword);
      if(!isValidPassword) {
        return res.status(400).json({message: CHANGE_PASSWORD_RESPONSE_MESSAGES.BAD_REQUEST.WEAK_PASSWORD})
      }

      const userRecord = await UserModel.findOne({
        where: { EMAIL : email },
      })

      if(!userRecord) {
        return res.status(404).json({message: CHANGE_PASSWORD_RESPONSE_MESSAGES.EMAIL_NOT_FOUND});
      }

      const userActivePasswordRecord = await PasswordModel.findOne({
        where: { USER_ID : userRecord.USER_ID, ACTIVE : true }
      })

      if(!userActivePasswordRecord) {
        return res.status(500).json({message: CHANGE_PASSWORD_RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR});
      }
      const oldPasswordSequence = userActivePasswordRecord.PASSWORD_SEQ;

      const isPasswordCorrect = await bcrypt.compare(
        oldPassword,
        userActivePasswordRecord.PASSWORD
      );

      if(!isPasswordCorrect) {
        return res.status(401).json({message: CHANGE_PASSWORD_RESPONSE_MESSAGES.UNAUTHORIZED});
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      await PasswordModel.update(
        { ACTIVE: false },
        { where : {USER_ID : userRecord.USER_ID, ACTIVE : true} }
      );

      await PasswordModel.create({
        PASSWORD_SEQ: oldPasswordSequence+1,
        USER_ID: userRecord.USER_ID,
        PASSWORD: hashedNewPassword,
        ACTIVE: true
      });

      return res.status(202).json({message: CHANGE_PASSWORD_RESPONSE_MESSAGES.SUCCESS});

    } catch (error) {

      console.error(error);
      return res.status(500).json({message: CHANGE_PASSWORD_RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR});
    
    }
}


module.exports = { changePassword }