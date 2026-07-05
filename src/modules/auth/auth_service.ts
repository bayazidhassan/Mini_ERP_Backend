import bcrypt from 'bcryptjs';
import { createAccessToken } from '../../utils/generateToken';
import { TUser } from '../users/user_interface';
import { User } from '../users/user_model';

const login = async (payload: Pick<TUser, 'email' | 'password'>) => {
  const user = await User.findOne({ email: payload.email }).select('+password');
  if (!user) {
    throw new Error('Invalid email or password.');
  }

  const isMatch = await bcrypt.compare(payload.password!, user.password);
  if (!isMatch) {
    throw new Error('Invalid email or password.');
  }

  const safeUser = await User.findById(user._id).select('-password');
  if (!safeUser) {
    throw new Error('User not found.');
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
