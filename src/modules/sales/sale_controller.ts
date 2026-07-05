import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { saleService } from './sale_service';

const createSale = catchAsync(async (req, res) => {
  const result = await saleService.createSale(req.body, req.user!.id);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: 'Sale created successfully.',
    data: result,
  });
});

export const saleController = {
  createSale,
};
