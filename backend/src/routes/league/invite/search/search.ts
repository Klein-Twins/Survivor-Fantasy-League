import express from 'express';
import profileSearchControler from '../../../../controllersBackup/profile/profileSearchController';

const router = express.Router();

router.get('/', profileSearchControler.getProfilesBySearch);

export default router;
