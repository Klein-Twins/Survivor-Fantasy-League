import express from 'express';
import surveyController from '../../controllers/league/survey/surveyController';

const router = express.Router({ mergeParams: true }); // Add mergeParams to access leagueId

router.get('/', surveyController.getSurveyForLeagueMember);

export default router;
