import express from 'express';
import leagueController from '../../controllers/league/leagueController';

import inviteRoutes from './invite/invite';

const router = express.Router();

router.use('/invite', inviteRoutes);
router.get('/:profileId/:seasonId', leagueController.getLeague);
router.post('/:profileId/:seasonId', leagueController.createLeague);

export default router;
