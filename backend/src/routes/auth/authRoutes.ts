import express from 'express';

import loginRoute from './loginRoute';
import signupRoute from './signupRoute';
import logoutRoute from './logoutRoute';

const router = express.Router();

router.use('/', [loginRoute, signupRoute, logoutRoute])

export default router;