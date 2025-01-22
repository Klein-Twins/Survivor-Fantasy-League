import express from 'express';
import tokenMiddleware from '../../middleware/tokenMiddleware';
import leagueInviteController from '../../controllers/leagues/leagueInviteController';

const router = express.Router();

router.get('/', tokenMiddleware.authenticateToken, leagueInviteController.getLeagueInvitesForProfileId);
router.post('/', tokenMiddleware.authenticateToken, leagueInviteController.createAndSendLeagueInvite);
router.put('/', tokenMiddleware.authenticateToken, leagueInviteController.respondToLeagueInvite);

export default router;