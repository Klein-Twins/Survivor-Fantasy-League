import express from 'express';
import leagueSurveyController from '../../controllers/leagues/leagueSurveyController';

const router = express.Router({ mergeParams: true }); // Add mergeParams to access leagueId

router.get('/', leagueSurveyController.getSurveyForLeagueMember);

export default router;
