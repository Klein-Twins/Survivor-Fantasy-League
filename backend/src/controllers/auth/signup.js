require('dotenv').config();
const { signupService } = require("../../services/auth/signup.js");
const { validateRequiredRequestFields } = require("./utils/validateRequest.js");
const errorHandler = require("../../middleware/errorHandler.js");
const { RESPONSE_MESSAGES } = require("../../routes/ResponseMessageConstants.js");

const signup = async (req, res) => {
    const requiredFields = ["email", "username", "password"];
    if (!validateRequiredRequestFields(req, res, requiredFields, RESPONSE_MESSAGES.SIGNUP)) {
        return res;
    }

    const { username, password, firstName, lastName } = req.body;
    let email = req.body.email.toLowerCase();

    try {
        const { statusCode, message, user, token } = await signupService({ username, email, password, firstName, lastName });
        //res.setHeader('Authorization', `Bearer ${token}`);
        res.set('Authorization', `Bearer ${token}`);
        res.status(statusCode).json({ message, user });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};

module.exports = signup;