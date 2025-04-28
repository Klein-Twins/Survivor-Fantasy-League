import express from 'express';

import inviteRoutes from './invite/invite';
import surveyRoutes from './survey/survey';
import leagueController from '../../controllers/league/leagueController';

const router = express.Router();

// router.use('/invite', inviteRoutes);
// router.use('/survey', surveyRoutes);
// router.get('/:profileId/:seasonId', leagueController.getLeague);
router.post('/:profileId/:seasonId', leagueController.createLeague);

export default router;
