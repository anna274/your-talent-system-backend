import * as express from 'express';
import * as positionStatusesController from 'controllers/positionStatuses';

const router = express.Router();

router.get('/', positionStatusesController.getAll);

export default router;