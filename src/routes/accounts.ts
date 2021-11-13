import * as express from 'express';
import * as accountsController from 'controllers/accounts';

const router = express.Router();

router.get('/:accountId', accountsController.getById);

export default router;
