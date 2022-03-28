import * as express from 'express';
import * as profilesController from 'controllers/profiles';

const router = express.Router();

router.get('/', profilesController.getAll);
router.get('/:profileId', profilesController.getById);
router.get('/account/:accountId', profilesController.getByAccountId);
router.post('/', profilesController.post);
router.put('/:profileId', profilesController.put);
router.delete('/:profileId', profilesController.deleteOne);

export default router;