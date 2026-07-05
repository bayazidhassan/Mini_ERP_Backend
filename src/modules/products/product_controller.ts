import catchAsync from '../../utils/catchAsync';
import { productService } from './product_service';

const createProduct = catchAsync(async (req, res) => {
  const result = await productService.createProduct(req.body, req.file?.buffer);
  res.status(201).json({
    success: true,
    message: 'Product created successfully.',
    data: result,
  });
});

const getProducts = catchAsync(async (req, res) => {
  const result = await productService.getProducts(req.query);

  res.status(200).json({
    success: true,
    message: 'Products retrieved successfully.',
    data: result.products,
    meta: result.meta,
  });
});

export const productController = {
  createProduct,
  getProducts,
};
