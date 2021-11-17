import * as express from 'express';
import { default as authRouter } from 'routes/auth';
import { default as accountsRouter } from 'routes/accounts';
import { default as scopesRouter } from 'routes/scopes';
import { default as technologiesRouter } from 'routes/technologies';
import { default as projectsRouter } from 'routes/projects';
import { default as departmentsRouter } from 'routes/departments';
import { default as jobFunctionsRouter } from 'routes/jobFunctions';
import { default as levelsRouter } from 'routes/levels';
import { default as profilesRouter } from 'routes/profiles';
import { passport } from 'index';
import { AUTH_STRATEGY } from 'consts';

const router = express.Router();

router.use('/auth', authRouter);
router.use(
  '/accounts',
  passport.authenticate(AUTH_STRATEGY, { session: false }),
  accountsRouter
);
router.use(
  '/scopes',
  passport.authenticate(AUTH_STRATEGY, { session: false }),
  scopesRouter
);
router.use(
  '/technologies',
  passport.authenticate(AUTH_STRATEGY, { session: false }),
  technologiesRouter
);
router.use(
  '/projects',
  passport.authenticate(AUTH_STRATEGY, { session: false }),
  projectsRouter
);
router.use(
  '/departments',
  passport.authenticate(AUTH_STRATEGY, { session: false }),
  departmentsRouter
);
router.use(
  '/jobFunctions',
  passport.authenticate(AUTH_STRATEGY, { session: false }),
  jobFunctionsRouter
);
router.use(
  '/levels',
  passport.authenticate(AUTH_STRATEGY, { session: false }),
  levelsRouter
);
router.use(
  '/profiles',
  passport.authenticate(AUTH_STRATEGY, { session: false }),
  profilesRouter
);

export default router;
