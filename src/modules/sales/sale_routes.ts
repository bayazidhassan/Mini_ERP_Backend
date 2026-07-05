import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { saleController } from './sale_controller';

const router = Router();

router.post(
  '/',
  authenticate,
  authorize('admin', 'manager', 'employee'),
  saleController.createSale,
);

export const saleRoutes = router;
