import { model, Schema } from 'mongoose';
import { TSale } from './sale_interface';

const saleProductSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product is required.'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required.'],
      min: [1, 'Quantity must be at least 1.'],
    },
    priceAtSale: {
      type: Number,
      required: [true, 'Price at sale is required.'],
      min: [0, 'Price cannot be negative.'],
    },
  },
  {
    _id: false,
  },
);

const saleSchema = new Schema<TSale>(
  {
    products: {
      type: [saleProductSchema],
      required: [true, 'At least one product is required.'],
      validate: {
        validator: (value: unknown[]) => value.length > 0,
        message: 'Sale must contain at least one product.',
      },
    },
    grandTotal: {
      type: Number,
      required: [true, 'Grand total is required.'],
      min: [0, 'Grand total cannot be negative.'],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Created by is required.'],
    },
  },
  {
    timestamps: true,
  },
);

export const Sale = model<TSale>('Sale', saleSchema);
