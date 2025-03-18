import express from 'express';
import leagueInviteController from '../../../controllers/league/leagueInviteController';

import searchRoutes from './search/search';

const router = express.Router();

router.use('/search', searchRoutes);
router.get(
  '/:profileId/:seasonId',
  leagueInviteController.getLeagueInvitesForProfileId
);
router.post(
  '/:profileId/:seasonId',
  leagueInviteController.createAndSendLeagueInvite
);
router.put(
  '/:profileId/:seasonId',
  leagueInviteController.respondToLeagueInvite
);

export default router;
