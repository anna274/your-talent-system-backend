import * as express from 'express';
import * as departmentsController from 'controllers/departments';

const router = express.Router();

router.get('/', departmentsController.getAll);

export default router;