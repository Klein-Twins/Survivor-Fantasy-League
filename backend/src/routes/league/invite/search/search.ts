import express from 'express';
import profileSearchControler from '../../../../controllers/profile/profileSearchController';

const router = express.Router();

router.get('/', profileSearchControler.getProfilesBySearch);

export default router;
