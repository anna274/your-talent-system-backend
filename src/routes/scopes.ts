import * as express from 'express';
import * as scopesController from 'controllers/scopes';

const router = express.Router();

router.get('/', scopesController.getAll);

export default router;