import httpStatus from 'http-status';
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { Product } from '../products/product_model';
import { TSale, TSaleProduct } from './sale_interface';
import { Sale } from './sale_model';

type TCreateSalePayload = {
  products: { product: string; quantity: number }[];
};

const createSale = async (payload: TCreateSalePayload, createdBy: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    if (!payload.products.length) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'At least one product is required.',
      );
    }

    // 1. Reject duplicate product IDs
    const productIds = payload.products.map((p) => p.product);
    if (new Set(productIds).size !== productIds.length) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Duplicate products are not allowed.',
      );
    }

    // 2. Fetch all products in one query
    const products = await Product.find({ _id: { $in: productIds } }).session(
      session,
    );

    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    let grandTotal = 0;
    const saleProducts: TSaleProduct[] = [];
    const stockUpdates: mongoose.AnyBulkWriteOperation[] = [];

    // 3. Validate + calculate + build updates
    for (const item of payload.products) {
      const product = productMap.get(item.product);

      if (!product) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          `Product not found: ${item.product}`,
        );
      }

      if (product.stockQuantity < item.quantity) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `Insufficient stock for ${product.name}.`,
        );
      }

      const subtotal = product.sellingPrice * item.quantity;
      grandTotal += subtotal;

      saleProducts.push({
        product: product._id,
        quantity: item.quantity,
        priceAtSale: product.sellingPrice,
      });

      stockUpdates.push({
        updateOne: {
          filter: { _id: product._id },
          update: { $inc: { stockQuantity: -item.quantity } },
        },
      });
    }

    // 4. Apply stock updates in one bulk operation
    await Product.bulkWrite(stockUpdates, { session });

    // 6. Create the sale
    const saleData: TSale = {
      products: saleProducts,
      grandTotal,
      createdBy: new mongoose.Types.ObjectId(createdBy),
    };

    const sale = await Sale.create([saleData], { session });

    await session.commitTransaction();

    return sale[0];
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    await session.endSession();
  }
};

export const saleService = {
  createSale,
};
