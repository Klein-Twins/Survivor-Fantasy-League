const validateRequiredRequestFields = (req, res, requiredFields, errorMessages) => {
    for(const field of requiredFields) {
        if(!req.body[field] || req.body[field].length === 0) {
            res
              .status(errorMessages[`BAD_REQUEST_NO_${field.toUpperCase()}`].statusCode || 400)
              .json({message: errorMessages[`BAD_REQUEST_NO_${field.toUpperCase()}`].message || "Bad Request"});
            return false;
        }
    }
    return true;
}

const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

module.exports = { validateRequiredRequestFields, validateEmail };