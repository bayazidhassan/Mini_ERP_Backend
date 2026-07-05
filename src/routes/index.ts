import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth_routes';
import { productRoutes } from '../modules/products/product_routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/product', productRoutes);

export default router;
