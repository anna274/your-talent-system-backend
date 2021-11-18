import * as express from 'express';
import * as statusesController from 'controllers/positionStatuses';

const router = express.Router();

router.get('/', statusesController.getAll);

export default router;