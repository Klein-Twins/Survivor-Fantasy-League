const login = require('./auth/login.js');
const signup = require('./auth/signup.js');
const changePassword = require('./auth/changePassword.js');

const authController = {
    login,
    signup,
    changePassword
}

module.exports = authController;