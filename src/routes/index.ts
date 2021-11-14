import * as express from 'express';
import { default as authRouter } from 'routes/auth';
import { default as accountsRouter } from 'routes/accounts';
import { default as scopesRouter } from 'routes/scopes';
import { default as technologiesRouter } from 'routes/technologies';
import { default as projectsRouter } from 'routes/projects';
import { passport } from 'index';
import { AUTH_STRATEGY } from 'consts';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/accounts', passport.authenticate(AUTH_STRATEGY, { session: false }), accountsRouter);
router.use('/scopes', passport.authenticate(AUTH_STRATEGY, { session: false }), scopesRouter);
router.use('/technologies', passport.authenticate(AUTH_STRATEGY, { session: false }), technologiesRouter);
router.use('/projects', passport.authenticate(AUTH_STRATEGY, { session: false }), projectsRouter);

export default router;
