import bcrypt from 'bcryptjs';
import AppError from '../../errors/AppError';
import { createAccessToken } from '../../utils/generateToken';
import { TUser } from '../users/user_interface';
import { User } from '../users/user_model';

const login = async (payload: Pick<TUser, 'email' | 'password'>) => {
  const user = await User.findOne({ email: payload.email }).select('+password');
  if (!user) {
    throw new AppError(401, 'Invalid credentials.');
  }
  const isMatch = await bcrypt.compare(payload.password!, user.password);
  if (!isMatch) {
    throw new AppError(401, 'Invalid credentials.');
  }

  const safeUser = await User.findById(user._id).select('-password');
  if (!safeUser) {
    throw new AppError(401, 'User not found.');
  }

  const accessToken = createAccessToken({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  });

  return { safeUser, accessToken };
};

export const authService = {
  login,
};
