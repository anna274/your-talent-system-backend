import * as express from 'express';
import * as jobFunctionsController from 'controllers/jobFunctions';

const router = express.Router();

router.get('/', jobFunctionsController.getAll);

export default router;
