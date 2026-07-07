import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth_routes';
import { dashboardRoutes } from '../modules/dashboard/dashboard_routes';
import { productRoutes } from '../modules/products/product_routes';
import { saleRoutes } from '../modules/sales/sale_routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/sales', saleRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
