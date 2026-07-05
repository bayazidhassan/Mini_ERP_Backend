import catchAsync from '../../utils/catchAsync';
import { authService } from './auth_service';

const login = catchAsync(async (req, res) => {
  const { safeUser, accessToken } = await authService.login(req.body);
  res.status(200).json({
    success: true,
    message: 'Login successful.',
    data: { safeUser, accessToken },
  });
});

export const authController = {
  login,
};
