import * as express from 'express';
import * as technologiesController from 'controllers/technologies';

const router = express.Router();

router.get('/', technologiesController.getAll);

export default router;