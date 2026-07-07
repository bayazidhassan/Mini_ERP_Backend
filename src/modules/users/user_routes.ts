import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { userController } from './user_controller';

const router = Router();

router.post('/', authenticate, authorize('admin'), userController.createUser);

export const userRoutes = router;
