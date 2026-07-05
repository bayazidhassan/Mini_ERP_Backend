import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { customerService } from './customer_service';

const createCustomer = catchAsync(async (req, res) => {
  const result = await customerService.createCustomer(req.body);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: 'Customer created successfully.',
    data: result,
  });
});

const getCustomers = catchAsync(async (req, res) => {
  const result = await customerService.getCustomers(req.query);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Customers retrieved successfully.',
    data: result.customers,
    meta: result.meta,
  });
});

const updateCustomer = catchAsync(async (req, res) => {
  const result = await customerService.updateCustomer(
    req.params.id as string,
    req.body,
  );

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Customer updated successfully.',
    data: result,
  });
});

const deleteCustomer = catchAsync(async (req, res) => {
  await customerService.deleteCustomer(req.params.id as string);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Customer deleted successfully.',
    data: null,
  });
});

export const customerController = {
  createCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
};
