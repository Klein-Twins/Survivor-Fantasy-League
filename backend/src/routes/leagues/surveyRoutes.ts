import express from 'express';
import leagueSurveyController from '../../controllers/leagues/leagueSurveyController';

const router = express.Router();

router.get('/', leagueSurveyController.getSurveyForLeagueMember);

export default router;
