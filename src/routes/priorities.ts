import * as express from 'express';
import * as prioritiesController from 'controllers/priorities';

const router = express.Router();

router.get('/', prioritiesController.getAll);

export default router;