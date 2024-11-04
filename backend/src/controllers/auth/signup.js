require('dotenv').config();
const { signupService } = require("../../services/auth/signup.js");
const { validateRequiredRequestFields } = require("./utils/validateRequest.js");
const errorHandler = require("../../middleware/errorHandler.js");
const { RESPONSE_MESSAGES } = require("../../routes/ResponseMessageConstants.js");

const { generateToken } = require("../../utils/jwt.js");

const signup = async (req, res) => {
    const requiredFields = ["email", "username", "password"];
    if (!validateRequiredRequestFields(req, res, requiredFields, RESPONSE_MESSAGES.SIGNUP)) {
        return res;
    }

    const { username, password, firstName, lastName } = req.body;
    let email = req.body.email.toLowerCase();

    try {
        const { statusCode, message, user } = await signupService({ username, email, password, firstName, lastName });
        const token = generateToken({ user })
        res.status(statusCode).json({ message, token, user });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};

module.exports = signup;