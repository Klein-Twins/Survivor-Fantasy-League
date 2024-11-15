import express from 'express';

import tokenMiddleware from '../../middleware/tokenMiddleware';
import leagueController from '../../controllers/leagues/leagueController';

const router = express.Router();

router.post('/', tokenMiddleware.authenticateToken, leagueController.createLeague);
router.get('/profile/:profileId', tokenMiddleware.authenticateToken, leagueController.getLeaguesForProfile)

export default router;