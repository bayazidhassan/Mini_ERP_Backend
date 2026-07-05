import QueryBuilder from '../../builder/QueryBuilder';
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

const getProducts = async (query: Record<string, unknown>) => {
  const productQuery = new QueryBuilder(Product.find(), query)
    .search(['name', 'sku'])
    .filter()
    .sort()
    .fields()
    .paginate();

  const [products, meta] = await Promise.all([
    productQuery.modelQuery,
    productQuery.countTotal(),
  ]);

  return {
    products,
    meta,
  };
};

const updateProduct = async (
  id: string,
  payload: Partial<TProduct>,
  buffer?: Buffer,
) => {
  const existingProduct = await Product.findById(id);

  if (!existingProduct) {
    throw new AppError(404, 'Product not found.');
  }

  if (buffer) {
    const image = await uploadImageToCloudinary(
      `${existingProduct.sku}-${Date.now()}`,
      buffer,
    );

    payload.image = image;
  }

  const updatedProduct = await Product.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return updatedProduct;
};

const deleteProduct = async (id: string) => {
  const deletedProduct = await Product.findByIdAndDelete(id);

  if (!deletedProduct) {
    throw new AppError(404, 'Product not found.');
  }

  return deletedProduct;
};

export const productService = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
};
