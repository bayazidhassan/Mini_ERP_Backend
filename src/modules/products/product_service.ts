import AppError from '../../errors/AppError';
import uploadImageToCloudinary from '../../utils/uploadImageToCloudinary';
import { TProduct } from './product_interface';
import { Product } from './product_model';

const createProduct = async (payload: TProduct, buffer?: Buffer) => {
  if (!buffer) {
    throw new AppError(400, 'Product image is required.');
  }
  const image = await uploadImageToCloudinary(
    payload.sku + '-' + Date.now(),
    buffer,
  );

  const product = await Product.create({
    ...payload,
    image,
  });

  return product;
};

export const productService = {
  createProduct,
};
