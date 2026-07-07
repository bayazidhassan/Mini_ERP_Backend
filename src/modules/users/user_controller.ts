import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { userService } from './user_service';

const createUser = catchAsync(async (req, res) => {
  const result = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).json({
    success: true,
    message: 'User created successfully.',
    data: result,
  });
});

export const userController = {
  createUser,
};
