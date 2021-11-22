import * as express from 'express';
import * as positionsController from 'controllers/positions';

const router = express.Router();

router.get('/', positionsController.getAll);
router.get('/:positionId', positionsController.getById);
router.post('/', positionsController.post);
router.put('/:positionId', positionsController.put);
router.delete('/:positionId', positionsController.deleteOne);
router.get('/get-candidates/:positionId', positionsController.getCandidates);

export default router;