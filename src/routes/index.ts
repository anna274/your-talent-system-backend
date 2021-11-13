import * as express from 'express';
import { default as authRouter } from 'routes/auth';
import { default as accountsRouter } from 'routes/accounts';
import { passport } from 'index';
import { AUTH_STRATEGY } from 'consts';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/accounts', passport.authenticate(AUTH_STRATEGY, { session: false }), accountsRouter);

export default router;
