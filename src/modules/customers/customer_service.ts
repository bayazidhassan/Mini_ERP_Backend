import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TCustomer } from './customer_interface';
import { Customer } from './customer_model';

const createCustomer = async (payload: TCustomer) => {
  const customer = await Customer.create(payload);

  return customer;
};

const getCustomers = async (query: Record<string, unknown>) => {
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
            phone: {
              $regex: search,
              $options: 'i',
            },
          },
          {
            email: {
              $regex: search,
              $options: 'i',
            },
          },
        ],
      }
    : {};

  const [customers, total] = await Promise.all([
    Customer.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Customer.countDocuments(filter),
  ]);

  return {
    customers,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
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
