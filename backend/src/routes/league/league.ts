import express from 'express';
import leagueController from '../../controllersBackup/league/leagueController';

import inviteRoutes from './invite/invite';
import surveyRoutes from './survey/survey';

const router = express.Router();

router.use('/invite', inviteRoutes);
router.use('/survey', surveyRoutes);
router.get('/:profileId/:seasonId', leagueController.getLeague);
router.post('/:profileId/:seasonId', leagueController.createLeague);

export default router;
