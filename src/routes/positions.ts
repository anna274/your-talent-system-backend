import * as express from 'express';
import * as positionsController from 'controllers/positions';

const router = express.Router();

router.get('/', positionsController.getAll);
router.get('/:positionId', positionsController.getById);
router.post('/', positionsController.post);
router.put('/:positionId', positionsController.put);
router.delete('/:positionId', positionsController.deleteOne);
router.get('/get-candidates/:positionId', positionsController.getCandidates);
router.put('/:positionId/add-candidate/:profileId', positionsController.addCandidate);
router.put('/:positionId/remove-candidate/:profileId', positionsController.removeCandidate);
router.put('/:positionId/set-specialist/:profileId', positionsController.setSpecialist);

export default router;