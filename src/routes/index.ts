import * as express from 'express';
import { default as authRouter } from 'routes/auth'
import { passport } from 'index';
import { AUTH_STRATEGY } from 'consts';

const router = express.Router();

router.use('/auth', authRouter);
// router.use('/users', passport.authenticate(AUTH_STRATEGY, { session: false }), usersRouter);

export default router;
