import * as express from 'express';
import * as departmentsController from 'controllers/departments';

const router = express.Router();

router.get('/', departmentsController.getAll);
router.post('/', departmentsController.post);
router.put('/:departmentId', departmentsController.put);
router.delete('/:departmentId', departmentsController.deleteOne);

export default router;