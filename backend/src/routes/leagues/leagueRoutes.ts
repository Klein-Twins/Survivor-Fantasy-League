import express from 'express';

import createLeagueRoute from './createLeagueRoute';

const router = express.Router();

router.use('/', [createLeagueRoute])

export default router;