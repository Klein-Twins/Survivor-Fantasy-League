const { loginService } = require("../../services/auth/login.js");
const { validateRequiredRequestFields } = require('./utils/validateRequest.js');
const errorHandler = require("../../middleware/errorHandler.js");
const { RESPONSE_MESSAGES } = require("../../routes/ResponseMessageConstants.js");

const login = async (req, res) => {
  const requiredFields = ["email", "password"];

  if (!validateRequiredRequestFields(req, res, requiredFields, RESPONSE_MESSAGES.LOGIN)) {
    return res;
  }

  const { password } = req.body;
  let email = req.body.email.toLowerCase();

  try {
    const {statusCode, message, user} = await loginService(email, password);
    res.status(statusCode).json({message, user});
  } catch (error) {
    console.error("Error in login:", error);
    return errorHandler(error, req, res);
  }
};

module.exports = login;