import express from 'express';
import leagueInviteController from '../../../controllers/league/leagueInviteController';

import searchRoutes from './search/search';

const router = express.Router();

router.use('/search', searchRoutes);
router.get('/:profileId', leagueInviteController.getLeagueInvitesForProfileId);
router.post('/', leagueInviteController.createAndSendLeagueInvite);
router.put('/', leagueInviteController.respondToLeagueInvite);

export default router;
