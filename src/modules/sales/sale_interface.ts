import { Types } from 'mongoose';

export type TSaleProduct = {
  product: Types.ObjectId;
  quantity: number;
  priceAtSale: number;
};

export type TSale = {
  customer: Types.ObjectId;
  products: TSaleProduct[];
  grandTotal: number;
  createdBy: Types.ObjectId;
};
