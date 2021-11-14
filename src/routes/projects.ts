import * as express from 'express';
import * as projectsController from 'controllers/projects';

const router = express.Router();

router.get('/', projectsController.getAll);
router.get('/:projectId', projectsController.getById);
router.post('/', projectsController.post);
router.put('/:projectId', projectsController.put);
router.delete('/:projectId', projectsController.deleteOne);

export default router;