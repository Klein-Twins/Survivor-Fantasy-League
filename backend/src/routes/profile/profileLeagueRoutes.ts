import express from 'express';
import tokenMiddleware from '../../middleware/tokenMiddleware';
import leagueController from '../../controllers/leagues/leagueController';
import profileController from '../../controllers/profile/profileController';

const router = express.Router();

router.get('/league', tokenMiddleware.authenticateToken, leagueController.getLeaguesForProfile);
router.post('/league', tokenMiddleware.authenticateToken, leagueController.createLeague);

router.get('/search', tokenMiddleware.authenticateToken, profileController.getProfilesBySearch);

export default router;