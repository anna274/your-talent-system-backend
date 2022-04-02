import * as express from 'express';
import * as technologiesController from 'controllers/technologies';

const router = express.Router();

router.get('/', technologiesController.getAll);
router.get('/:technologyId', technologiesController.getById);
router.post('/', technologiesController.post);
router.put('/:technologyId', technologiesController.put);
router.delete('/:technologyId', technologiesController.deleteOne);

export default router;