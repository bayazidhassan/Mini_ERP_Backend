import { RequestHandler } from 'express';
import { authService } from './auth_service';

const login: RequestHandler = async (req, res) => {
  try {
    const { safeUser, accessToken } = await authService.login(req.body);
    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: { safeUser, accessToken },
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: (err as Error).message || 'Login failed.',
      data: null,
    });
  }
};

export const authController = {
  login,
};
