import { model, Schema } from 'mongoose';
import { TRole, TUser } from './user_interface';

const role: TRole[] = ['admin', 'manager', 'employee'];

const userSchema = new Schema<TUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required.'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: {
        values: role,
        message: 'User role must be admin, manager or employee.',
      },
      required: [true, 'User role is required.'],
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

export const User = model<TUser>('User', userSchema);
