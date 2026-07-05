import mongoose from 'mongoose';
import { TErrorSource, TGenericErrorResponse } from './errorInterface';

export const handleMongooseValidationError = (
  err: mongoose.Error.ValidationError,
): TGenericErrorResponse => {
  const errorSource: TErrorSource[] = Object.values(err.errors).map(
    (error: mongoose.Error.ValidatorError | mongoose.Error.CastError) => ({
      path: error?.path,
      message: error?.message,
    }),
  );

  const statusCode = 400;
  return {
    statusCode,
    message: 'Validation Error',
    errorSource,
  };
};
