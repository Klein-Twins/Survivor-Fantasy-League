import express from 'express';
import tokenMiddleware from '../../middleware/tokenMiddleware';
import profileSearchControler from '../../controllers/profile/profileSearchController';
// import leagueProfileController from '../../controllers/leagues/leagueProfileController';

const router = express.Router();

router.get(
  '/search',
  tokenMiddleware.authenticateToken,
  profileSearchControler.getProfilesBySearch
);
// router.post('/invite', tokenMiddleware.authenticateToken, leagueProfileController.inviteProfileToLeague);
// router.get('/invite', tokenMiddleware.authenticateToken, leagueProfileController.getLeagueInvitesForProfile);
// router.post('/invite/respond', tokenMiddleware.authenticateToken, leagueProfileController.respondToLeagueInvite);

export default router;
