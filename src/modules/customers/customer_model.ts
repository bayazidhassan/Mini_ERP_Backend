import { model, Schema } from 'mongoose';
import { TCustomer } from './customer_interface';

const customerSchema = new Schema<TCustomer>(
  {
    name: {
      type: String,
      required: [true, 'Customer name is required.'],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required.'],
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Customer = model<TCustomer>('Customer', customerSchema);
