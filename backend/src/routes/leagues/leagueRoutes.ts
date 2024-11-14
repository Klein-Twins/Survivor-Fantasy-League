import express from 'express';

import tokenMiddleware from '../../middleware/tokenMiddleware';
import leagueController from '../../controllers/leagues/leagueController';

const router = express.Router();

router.post('/', tokenMiddleware.authenticateToken, leagueController.createLeague);

export default router;