import httpStatus from 'http-status';
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { Customer } from '../customers/customer_model';
import { Product } from '../products/product_model';
import { TSale, TSaleProduct } from './sale_interface';
import { Sale } from './sale_model';

type TCreateSalePayload = {
  customer: string;
  products: { product: string; quantity: number }[];
};

const createSale = async (payload: TCreateSalePayload, createdBy: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // 1. Verify customer exists
    const customer = await Customer.findById(payload.customer).session(session);
    if (!customer) {
      throw new AppError(httpStatus.NOT_FOUND, 'Customer not found.');
    }

    // 2. Reject duplicate product IDs
    const productIds = payload.products.map((p) => p.product);
    if (new Set(productIds).size !== productIds.length) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Duplicate products are not allowed.',
      );
    }

    // 3. Fetch all products in one query
    const products = await Product.find({ _id: { $in: productIds } }).session(
      session,
    );

    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    let grandTotal = 0;
    const saleProducts: TSaleProduct[] = [];
    const stockUpdates: mongoose.AnyBulkWriteOperation[] = [];

    // 4. Validate + calculate + build updates
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

    // 5. Apply stock updates in one bulk operation
    await Product.bulkWrite(stockUpdates, { session });

    // 6. Create the sale
    const saleData: TSale = {
      customer: customer._id,
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
    session.endSession();
  }
};

export const saleService = {
  createSale,
};
