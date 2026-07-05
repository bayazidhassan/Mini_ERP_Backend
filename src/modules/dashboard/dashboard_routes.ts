import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { dashboardController } from './dashboard_controller';

const router = Router();

router.get('/', authenticate, dashboardController.getDashboardStats);

export const dashboardRoutes = router;
