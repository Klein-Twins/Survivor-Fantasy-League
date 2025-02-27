import express from 'express';
import tokenMiddleware from '../../middleware/tokenMiddleware';
import leagueController from '../../controllers/league/leagueController';
import profileSearchControler from '../../controllers/profile/profileSearchController';

const router = express.Router();

router.get(
  '/league',
  tokenMiddleware.authenticateToken,
  leagueController.getLeague
);
router.post(
  '/league',
  tokenMiddleware.authenticateToken,
  leagueController.createLeague
);

router.get(
  '/search',
  tokenMiddleware.authenticateToken,
  profileSearchControler.getProfilesBySearch
);

export default router;
