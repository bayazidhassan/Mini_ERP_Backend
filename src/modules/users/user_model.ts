import bcrypt from 'bcryptjs';
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

userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const hashed = await bcrypt.hash(
    this.password,
    Number(process.env.BCRYPT_SALT),
  );
  this.password = hashed;
});

export const User = model<TUser>('User', userSchema);
