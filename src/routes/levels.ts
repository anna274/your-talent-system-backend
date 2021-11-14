import * as express from 'express';
import * as levelsController from 'controllers/levels';

const router = express.Router();

router.get('/', levelsController.getAll);

export default router;