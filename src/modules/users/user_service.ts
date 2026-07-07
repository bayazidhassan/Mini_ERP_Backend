import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TUser } from './user_interface';
import { User } from './user_model';

const createUser = async (
  payload: Pick<TUser, 'name' | 'email' | 'password' | 'role'>,
) => {
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'A user with this email already exists.',
    );
  }

  const user = await User.create(payload);
  const safeUser = await User.findById(user._id).select('-password');
  return safeUser;
};

export const userService = {
  createUser,
};
