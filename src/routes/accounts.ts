import * as express from 'express';
import * as accountsController from 'controllers/accounts';

const router = express.Router();

router.get('/:accountId', accountsController.getById);
router.put('/change-password/:userId', accountsController.putPassword);

export default router;
