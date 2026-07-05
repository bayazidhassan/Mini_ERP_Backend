import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { customerController } from './customer_controller';

const router = Router();

router.post(
  '/',
  authenticate,
  authorize('admin', 'manager'),
  customerController.createCustomer,
);

router.get(
  '/',
  authenticate,
  authorize('admin', 'manager', 'employee'),
  customerController.getCustomers,
);

router.patch(
  '/:id',
  authenticate,
  authorize('admin', 'manager'),
  customerController.updateCustomer,
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin', 'manager'),
  customerController.deleteCustomer,
);

export const customerRoutes = router;
