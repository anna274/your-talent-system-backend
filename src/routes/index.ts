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
import { default as prioritiesRouter } from 'routes/priorities';
import { default as positionsRouter } from 'routes/positions';
import { default as statisticsRouter } from 'routes/statistics';
import { default as statisticsTypesRouter } from 'routes/statisticsTypes';
import { default as positionStatusesRouter } from 'routes/positionStatuses';
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
router.use(
  '/priorities',
  passport.authenticate(AUTH_STRATEGY, { session: false }),
  prioritiesRouter
);
router.use(
  '/positions',
  passport.authenticate(AUTH_STRATEGY, { session: false }),
  positionsRouter
);
router.use(
  '/statistics',
  passport.authenticate(AUTH_STRATEGY, { session: false }),
  statisticsRouter
);
router.use(
  '/statistics_types',
  passport.authenticate(AUTH_STRATEGY, { session: false }),
  statisticsTypesRouter
);
router.use(
  '/position_statuses',
  passport.authenticate(AUTH_STRATEGY, { session: false }),
  positionStatusesRouter
);

export default router;
