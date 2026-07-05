import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { TCustomer } from './customer_interface';
import { Customer } from './customer_model';

const createCustomer = async (payload: TCustomer) => {
  const customer = await Customer.create(payload);

  return customer;
};

const getCustomers = async (query: Record<string, unknown>) => {
  const customerQuery = new QueryBuilder(Customer.find(), query)
    .search(['name', 'email', 'phone'])
    .filter()
    .sort()
    .fields()
    .paginate();

  const [customers, meta] = await Promise.all([
    customerQuery.modelQuery,
    customerQuery.countTotal(),
  ]);

  return {
    customers,
    meta,
  };
};

const updateCustomer = async (id: string, payload: Partial<TCustomer>) => {
  const customer = await Customer.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!customer) {
    throw new AppError(httpStatus.NOT_FOUND, 'Customer not found.');
  }

  return customer;
};

const deleteCustomer = async (id: string) => {
  const customer = await Customer.findByIdAndDelete(id);

  if (!customer) {
    throw new AppError(httpStatus.NOT_FOUND, 'Customer not found.');
  }

  return customer;
};

export const customerService = {
  createCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
};
