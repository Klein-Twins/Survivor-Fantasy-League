import express from 'express';
import tokenMiddleware from '../../middleware/tokenMiddleware';
import leagueProfileController from '../../controllers/leagues/leagueProfileController';

const router = express.Router();

router.get('/search', tokenMiddleware.authenticateToken, leagueProfileController.getProfilesBySearch);
router.post('/invite', tokenMiddleware.authenticateToken, leagueProfileController.inviteProfileToLeague);


export default router;