import * as express from 'express';
import * as statisticsController from 'controllers/statistics';

const router = express.Router();

router.get('/', statisticsController.getAll);
router.get('/:statisticsId', statisticsController.getById);
router.post('/', statisticsController.post);
router.put('/:statisticsId', statisticsController.put);
router.delete('/:statisticsId', statisticsController.deleteOne);

export default router;