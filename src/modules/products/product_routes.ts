import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { upload } from '../../utils/uploadImageToCloudinary';
import { productController } from './product_controller';

const router = Router();

router.post(
  '/createProduct',
  authenticate,
  authorize('admin', 'manager'),
  upload.single('image'),
  productController.createProduct,
);

export const productRoutes = router;
