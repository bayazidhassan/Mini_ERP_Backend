import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import validateRequest from '../../middlewares/validateRequest';
import { saleController } from './sale_controller';
import { saleValidation } from './sale_validation';

const router = Router();

router.post(
  '/',
  authenticate,
  authorize('admin', 'manager', 'employee'),
  validateRequest(saleValidation.createSaleSchema),
  saleController.createSale,
);

export const saleRoutes = router;
