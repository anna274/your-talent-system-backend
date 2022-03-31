import * as express from 'express';
import * as jobFunctionsController from 'controllers/jobFunctions';

const router = express.Router();

router.get('/', jobFunctionsController.getAll);
router.post('/', jobFunctionsController.post);
router.put('/:jobFunctionId', jobFunctionsController.put);
router.delete('/:jobFunctionId', jobFunctionsController.deleteOne);

export default router;
