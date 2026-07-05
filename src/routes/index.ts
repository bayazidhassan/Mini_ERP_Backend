import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth_routes';
import { customerRoutes } from '../modules/customers/customer_routes';
import { productRoutes } from '../modules/products/product_routes';
import { saleRoutes } from '../modules/sales/sale_routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/product', productRoutes);
router.use('/customer', customerRoutes);
router.use('/sale', saleRoutes);

export default router;
