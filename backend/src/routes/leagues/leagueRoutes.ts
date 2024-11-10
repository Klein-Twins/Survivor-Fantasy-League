import express from 'express';

import createLeagueRoute from './createLeagueRoute';

const router = express.Router();

router.use('/league', [createLeagueRoute])

export default router;