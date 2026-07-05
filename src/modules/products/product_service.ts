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
  const search = (query.search as string) || '';
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  const skip = (page - 1) * limit;

  const filter = search
    ? {
        $or: [
          {
            name: {
              $regex: search,
              $options: 'i',
            },
          },
          {
            sku: {
              $regex: search,
              $options: 'i',
            },
          },
        ],
      }
    : {};

  const products = await Product.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Product.countDocuments(filter);

  return {
    products,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
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
