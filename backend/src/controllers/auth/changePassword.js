const { changePasswordService } = require("../../services/auth/changePassword.js");
const { validateRequiredRequestFields } = require("./utils/validateRequest.js");
const errorHandler = require("../../middleware/errorHandler.js");
const { RESPONSE_MESSAGES } = require("../../routes/ResponseMessageConstants.js");

const changePassword = async (req, res) => {
    const requiredFields = ["email", "oldPassword", "newPassword"];
    if (!validateRequiredRequestFields(req, res, requiredFields, RESPONSE_MESSAGES.CHANGE_PASSWORD)) {
        return res;
    }

    const { oldPassword, newPassword } = req.body;
    let email = req.body.email.toLowerCase();

    try {
        const { statusCode, message } = await changePasswordService(email, oldPassword, newPassword);
        res.status(statusCode).json({ message });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};

module.exports = changePassword;