const express = require('express');
const router = express.Router();

const loginRoute = require('./auth/login.js');
const signupRoute = require('./auth/signup.js');
const changePasswordRoute = require('./auth/changePassword.js');

const survivorRoute = require('./survivors/getSurvivors.js');

router.use('/auth', [loginRoute, signupRoute, changePasswordRoute]);
router.use('/', survivorRoute);

module.exports = router;