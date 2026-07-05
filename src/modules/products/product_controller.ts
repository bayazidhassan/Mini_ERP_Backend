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

const updateProduct = catchAsync(async (req, res) => {
  const result = await productService.updateProduct(
    req.params.id as string,
    req.body,
    req.file?.buffer,
  );

  res.status(200).json({
    success: true,
    message: 'Product updated successfully.',
    data: result,
  });
});

const deleteProduct = catchAsync(async (req, res) => {
  await productService.deleteProduct(req.params.id as string);

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully.',
    data: null,
  });
});

export const productController = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
};
