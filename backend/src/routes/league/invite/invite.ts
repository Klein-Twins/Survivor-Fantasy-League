import express from 'express';
import leagueInviteController from '../../../controllers/league/invite/leagueInviteController';

// import searchRoutes from './search/search';

const router = express.Router();

// router.use('/search', searchRoutes);
router.get('/:profileId/:seasonId', leagueInviteController.getLeagueInvites);
router.post('/:profileId/:seasonId', leagueInviteController.sendLeagueInvite);
router.put(
  '/:profileId/:seasonId',
  leagueInviteController.respondToLeagueInvite
);

export default router;
