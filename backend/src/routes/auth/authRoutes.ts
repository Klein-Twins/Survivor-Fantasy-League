import express from 'express';

import loginRoute from './loginRoute';
import signupRoute from './signupRoute';
import logoutRoute from './logoutRoute';
import dummyAuthTokenRoute from './dummyAuthTokenRoute';
import refreshTokenRoute from './refreshTokenRoute';

const router = express.Router();

router.use('/', [loginRoute, signupRoute, logoutRoute, dummyAuthTokenRoute, refreshTokenRoute ])

export default router;