import * as express from 'express';
import * as authController from 'controllers/auth';
import { passport } from 'index';
import { REFRESH_STRATEGY } from 'consts';

const router = express.Router();

router.post('/login', authController.login);
router.post('/refresh', passport.authenticate(REFRESH_STRATEGY, { session: false }), authController.refresh);
router.delete('/logout/:userId', authController.logout);

export default router;