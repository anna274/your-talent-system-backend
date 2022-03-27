import * as express from 'express';
import * as statisticsTypesController from 'controllers/statisticsTypes';

const router = express.Router();

router.get('/', statisticsTypesController.getAll);

export default router;