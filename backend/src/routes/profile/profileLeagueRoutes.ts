import express from 'express';
import tokenMiddleware from '../../middleware/tokenMiddleware';
import profileLeagueController from '../../controllers/profile/profileLeagueController';

const router = express.Router();

router.get('/', tokenMiddleware.authenticateToken, profileLeagueController.getLeaguesForProfile);
router.post('/', tokenMiddleware.authenticateToken, profileLeagueController.createLeague);

export default router;