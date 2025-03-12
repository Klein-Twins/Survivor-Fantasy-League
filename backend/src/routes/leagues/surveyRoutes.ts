import express from 'express';
import surveyController from '../../controllers/league/survey/surveyController';

const router = express.Router(); // Add mergeParams to access leagueId

router.get(
  '/:leagueId/:profileId/:episodeId',
  surveyController.getSurveyForLeagueMember
);
router.post('/submit', surveyController.submitSurvey);

export default router;
