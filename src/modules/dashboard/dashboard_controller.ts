import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { dashboardService } from './dashboard_service';

const getDashboardStats = catchAsync(async (req, res) => {
  const result = await dashboardService.getDashboardStats();

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Dashboard statistics retrieved successfully.',
    data: result,
  });
});

export const dashboardController = {
  getDashboardStats,
};
